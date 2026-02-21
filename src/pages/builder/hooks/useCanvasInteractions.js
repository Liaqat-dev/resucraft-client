import { useState } from 'react';

export function useCanvasInteractions({
    sections, elements, selectedIds, scale, showGrid, gridSize, canvasRef,
    setSections, setElements, setSelectedIds, updateSection, updateElement
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [draggingSectionId, setDraggingSectionId] = useState(null);
    const [selectionBox, setSelectionBox] = useState(null);

    const snapToGrid = (value) => {
        if (!showGrid) return value;
        return Math.round(value / gridSize) * gridSize;
    };

    // Still used for resize overlap prevention
    const checkSectionOverlap = (sectionId, newX, newY, newWidth, newHeight, excludeIds = new Set()) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section || section.type === 'subsection') return false;

        for (const otherSection of sections) {
            if (otherSection.id === sectionId) continue;
            if (excludeIds.has(otherSection.id)) continue;
            if (otherSection.type === 'subsection') continue;
            if (otherSection.parentSection) continue;

            const overlap = !(
                newX + newWidth <= otherSection.x ||
                newX >= otherSection.x + otherSection.width ||
                newY + newHeight <= otherSection.y ||
                newY >= otherSection.y + otherSection.height
            );
            if (overlap) return true;
        }
        return false;
    };

    const getAlreadyOverlapping = (sectionId) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section || section.type === 'subsection') return new Set();
        const overlapping = new Set();
        for (const otherSection of sections) {
            if (otherSection.id === sectionId) continue;
            if (otherSection.type === 'subsection') continue;
            if (otherSection.parentSection) continue;
            const overlap = !(
                section.x + section.width <= otherSection.x ||
                section.x >= otherSection.x + otherSection.width ||
                section.y + section.height <= otherSection.y ||
                section.y >= otherSection.y + otherSection.height
            );
            if (overlap) overlapping.add(otherSection.id);
        }
        return overlapping;
    };

    const findSectionAtPoint = (x, y) => {
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (x >= section.x && x <= section.x + section.width &&
                y >= section.y && y <= section.y + section.height) {
                return section.id;
            }
        }
        return null;
    };

    const startDragging = (e, id) => {
        const draggingSection = sections.find(s => s.id === id);
        const isTopLevelSection =
            draggingSection &&
            draggingSection.type !== 'subsection' &&
            !draggingSection.parentSection;

        // Single top-level section drag → reorder mode
        if (isTopLevelSection && selectedIds.length === 1) {
            startSectionReorderDrag(e, id, draggingSection);
        } else {
            startFreeDrag(e, id);
        }
    };

    // ── Reorder drag: top-level sections slide past each other ──────────────

    const startSectionReorderDrag = (e, id, draggingSection) => {
        setIsDragging(true);
        setDraggingSectionId(id);

        const startClientY = e.clientY;
        const startSectionY = draggingSection.y;

        // Snapshot all top-level sections sorted by y at drag start
        const topLevelSecs = sections
            .filter(s => s.type !== 'subsection' && !s.parentSection)
            .sort((a, b) => a.y - b.y);

        // If only one section there's nothing to reorder
        if (topLevelSecs.length <= 1) {
            setIsDragging(false);
            setDraggingSectionId(null);
            startFreeDrag(e, id);
            return;
        }

        // Heights captured at drag start (don't change during drag)
        const heights = new Map(topLevelSecs.map(s => [s.id, s.height]));

        // Stack anchor — where the top of the first section sits
        const baseY = topLevelSecs[0].y;

        // Vertical gap between sections
        const GAP = 8;

        // Build a descendant lookup for ALL top-level sections:
        //   descendantLookup: descendantId → { topLevelId, offsetY }
        // This lets us move every element/subsection when its ancestor top-level section moves.
        const descendantLookup = new Map();
        const collectDescendants = (topLevelId, parentId, topLevelY) => {
            sections.forEach(sec => {
                if (sec.parentSection === parentId) {
                    descendantLookup.set(sec.id, { topLevelId, offsetY: sec.y - topLevelY });
                    collectDescendants(topLevelId, sec.id, topLevelY);
                }
            });
            elements.forEach(el => {
                if (el.parentSection === parentId) {
                    descendantLookup.set(el.id, { topLevelId, offsetY: el.y - topLevelY });
                }
            });
        };
        topLevelSecs.forEach(sec => collectDescendants(sec.id, sec.id, sec.y));

        // Live order — mutable so we can mutate it in-place across mouse moves
        const currentOrder = topLevelSecs.map(s => s.id);

        // Compute the packed slot y for every section in a given order
        const computeSlots = (orderIds) => {
            const slots = {};
            let y = baseY;
            for (const sid of orderIds) {
                slots[sid] = y;
                y += (heights.get(sid) ?? 0) + GAP;
            }
            return slots;
        };

        const handleMouseMove = (moveEvent) => {
            const deltaY = (moveEvent.clientY - startClientY) / scale;
            const newSectionY = snapToGrid(startSectionY + deltaY);

            // Dragged section's vertical midpoint
            const draggedMid = newSectionY + (heights.get(id) ?? 0) / 2;

            // Use current slot positions as reference midpoints for other sections
            const slots = computeSlots(currentOrder);
            const others = currentOrder.filter(sid => sid !== id);

            // Find where dragged section should be inserted
            let insertIdx = others.length;
            for (let i = 0; i < others.length; i++) {
                const slotMid = slots[others[i]] + (heights.get(others[i]) ?? 0) / 2;
                if (draggedMid < slotMid) {
                    insertIdx = i;
                    break;
                }
            }

            // Rebuild order with dragged section in new position
            const newOrder = [
                ...others.slice(0, insertIdx),
                id,
                ...others.slice(insertIdx),
            ];

            // Mutate currentOrder only when it actually changes
            const orderChanged = newOrder.some((sid, i) => sid !== currentOrder[i]);
            if (orderChanged) {
                currentOrder.length = 0;
                newOrder.forEach(sid => currentOrder.push(sid));
            }

            // Compute fresh slots after potential order change
            const activeSlots = computeSlots(currentOrder);

            setSections(prev => prev.map(sec => {
                // Dragged top-level section: follows mouse
                if (sec.id === id) return { ...sec, y: newSectionY };
                // Other top-level sections: move to their reflow slot
                if (activeSlots[sec.id] !== undefined) return { ...sec, y: activeSlots[sec.id] };
                // Subsections: move with their top-level ancestor
                const info = descendantLookup.get(sec.id);
                if (info) {
                    const parentY = info.topLevelId === id
                        ? newSectionY
                        : activeSlots[info.topLevelId];
                    if (parentY !== undefined) return { ...sec, y: parentY + info.offsetY };
                }
                return sec;
            }));

            setElements(prev => prev.map(el => {
                // All elements: move with their top-level ancestor
                const info = descendantLookup.get(el.id);
                if (info) {
                    const parentY = info.topLevelId === id
                        ? newSectionY
                        : activeSlots[info.topLevelId];
                    if (parentY !== undefined) return { ...el, y: parentY + info.offsetY };
                }
                return el;
            }));
        };

        const handleMouseUp = () => {
            // Snap every section into its final slot
            const finalSlots = computeSlots(currentOrder);

            setSections(prev => prev.map(sec => {
                // Top-level sections (including dragged) → final slot
                if (finalSlots[sec.id] !== undefined) return { ...sec, y: finalSlots[sec.id] };
                // Subsections → move with their top-level ancestor's final slot
                const info = descendantLookup.get(sec.id);
                if (info) {
                    const parentY = finalSlots[info.topLevelId];
                    if (parentY !== undefined) return { ...sec, y: parentY + info.offsetY };
                }
                return sec;
            }));

            setElements(prev => prev.map(el => {
                const info = descendantLookup.get(el.id);
                if (info) {
                    const parentY = finalSlots[info.topLevelId];
                    if (parentY !== undefined) return { ...el, y: parentY + info.offsetY };
                }
                return el;
            }));

            setIsDragging(false);
            setDraggingSectionId(null);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // ── Free drag: subsections, elements, and multi-selection ───────────────

    const startFreeDrag = (e, id) => {
        setIsDragging(true);

        const startX = e.clientX;
        const startY = e.clientY;

        let itemsToMove = new Set(selectedIds);

        const collectChildren = (parentId) => {
            elements.forEach(el => {
                if (el.parentSection === parentId) itemsToMove.add(el.id);
            });
            sections.forEach(sec => {
                if (sec.parentSection === parentId) {
                    itemsToMove.add(sec.id);
                    collectChildren(sec.id);
                }
            });
        };
        selectedIds.forEach(selectedId => collectChildren(selectedId));

        const initialPositions = new Map();
        itemsToMove.forEach(itemId => {
            const section = sections.find(s => s.id === itemId);
            const element = elements.find(el => el.id === itemId);
            if (section) initialPositions.set(itemId, { x: section.x, y: section.y });
            else if (element) initialPositions.set(itemId, { x: element.x, y: element.y });
        });

        const handleMouseMove = (moveEvent) => {
            const deltaX = (moveEvent.clientX - startX) / scale;
            const deltaY = (moveEvent.clientY - startY) / scale;

            const primaryPos = initialPositions.get(id);
            const snappedPrimaryX = snapToGrid(primaryPos.x + deltaX);
            const snappedPrimaryY = snapToGrid(primaryPos.y + deltaY);
            const snappedDeltaX = snappedPrimaryX - primaryPos.x;
            const snappedDeltaY = snappedPrimaryY - primaryPos.y;

            setSections(prev => prev.map(sec => {
                if (!itemsToMove.has(sec.id)) return sec;
                const initialPos = initialPositions.get(sec.id);
                if (!initialPos) return sec;
                return { ...sec, x: initialPos.x + snappedDeltaX, y: initialPos.y + snappedDeltaY };
            }));

            setElements(prev => prev.map(el => {
                if (!itemsToMove.has(el.id)) return el;
                const initialPos = initialPositions.get(el.id);
                if (!initialPos) return el;
                return { ...el, x: initialPos.x + snappedDeltaX, y: initialPos.y + snappedDeltaY };
            }));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // ────────────────────────────────────────────────────────────────────────

    const handleItemMouseDown = (e, id) => {
        e.stopPropagation();

        if (e.target.getAttribute('contenteditable') === 'true') {
            if (!selectedIds.includes(id)) {
                setSelectedIds([id]);
            }
            return;
        }

        if (e.shiftKey || e.ctrlKey || e.metaKey) {
            if (selectedIds.includes(id)) {
                setSelectedIds(prev => prev.filter(sid => sid !== id));
            } else {
                setSelectedIds(prev => [...prev, id]);
            }
            return;
        }

        if (!selectedIds.includes(id)) {
            setSelectedIds([id]);
        }

        startDragging(e, id);
    };

    const handleCanvasMouseDown = (e) => {
        if (e.target !== canvasRef.current) return;

        setSelectedIds([]);

        const rect = canvasRef.current.getBoundingClientRect();
        const startX = (e.clientX - rect.left) / scale;
        const startY = (e.clientY - rect.top) / scale;

        let currentBox = { startX, startY, endX: startX, endY: startY };
        setSelectionBox(currentBox);

        const handleMouseMove = (moveEvent) => {
            const endX = (moveEvent.clientX - rect.left) / scale;
            const endY = (moveEvent.clientY - rect.top) / scale;
            currentBox = { startX, startY, endX, endY };
            setSelectionBox(currentBox);
        };

        const handleMouseUp = () => {
            const minX = Math.min(currentBox.startX, currentBox.endX);
            const maxX = Math.max(currentBox.startX, currentBox.endX);
            const minY = Math.min(currentBox.startY, currentBox.endY);
            const maxY = Math.max(currentBox.startY, currentBox.endY);

            const selected = [];

            sections.forEach(sec => {
                const secCenterX = sec.x + sec.width / 2;
                const secCenterY = sec.y + sec.height / 2;
                if (secCenterX >= minX && secCenterX <= maxX &&
                    secCenterY >= minY && secCenterY <= maxY) {
                    selected.push(sec.id);
                }
            });

            elements.forEach(el => {
                const elCenterX = el.x + el.width / 2;
                const elCenterY = el.y + el.height / 2;
                if (elCenterX >= minX && elCenterX <= maxX &&
                    elCenterY >= minY && elCenterY <= maxY) {
                    selected.push(el.id);
                }
            });

            if (selected.length > 0) {
                setSelectedIds(selected);
            }

            setSelectionBox(null);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleCanvasDoubleClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        const parentSection = findSectionAtPoint(x, y);
        const section = sections.find(s => s.id === parentSection);

        let newElement;

        if (section) {
            if (section.contentType === 'text') {
                newElement = {
                    id: Date.now().toString(),
                    type: 'text',
                    content: 'New Text',
                    ai_description: 'Text element',
                    x: x - 50,
                    y: y - 15,
                    width: 200,
                    height: 40,
                    fontSize: 12,
                    fontWeight: 'normal',
                    fontFamily: 'Times New Roman',
                    color: '#000000',
                    textAlign: 'left',
                    lineHeight: 1.5,
                    parentSection
                };
            } else if (section.contentType === 'list-items') {
                newElement = {
                    id: Date.now().toString(),
                    type: 'list-item',
                    content: '• New list item',
                    ai_description: 'List item',
                    x: x - 50,
                    y: y - 15,
                    width: section.width - 40,
                    height: 30,
                    fontSize: 12,
                    fontWeight: 'normal',
                    fontFamily: 'Times New Roman',
                    color: '#000000',
                    textAlign: 'left',
                    lineHeight: 1.6,
                    bulletType: 'disc',
                    parentSection
                };
            }
        } else {
            newElement = {
                id: Date.now().toString(),
                type: 'text',
                content: 'New Text',
                ai_description: 'Text element on canvas',
                x: x - 50,
                y: y - 15,
                width: 200,
                height: 40,
                fontSize: 12,
                fontWeight: 'normal',
                fontFamily: 'Times New Roman',
                color: '#000000',
                textAlign: 'left',
                lineHeight: 1.5,
                parentSection: null
            };
        }

        if (newElement) {
            setElements(prev => [...prev, newElement]);
            setSelectedIds([newElement.id]);
        }
    };

    const handleResizeMouseDown = (e, id, handle, isSection = false) => {
        e.stopPropagation();

        const item = isSection
            ? sections.find(sec => sec.id === id)
            : elements.find(el => el.id === id);

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = item.width;
        const startHeight = item.height;
        const startPosX = item.x;
        const startPosY = item.y;

        const resizeExcludeIds = isSection ? getAlreadyOverlapping(id) : new Set();

        const handleMouseMove = (moveEvent) => {
            const deltaX = (moveEvent.clientX - startX) / scale;
            const deltaY = (moveEvent.clientY - startY) / scale;

            let updates = {};

            switch (handle) {
                case 'se':
                    updates = {
                        width: Math.max(50, snapToGrid(startWidth + deltaX)),
                        height: Math.max(30, snapToGrid(startHeight + deltaY))
                    };
                    break;
                case 'sw':
                    updates = {
                        x: snapToGrid(startPosX + deltaX),
                        width: Math.max(50, snapToGrid(startWidth - deltaX)),
                        height: Math.max(30, snapToGrid(startHeight + deltaY))
                    };
                    break;
                case 'ne':
                    updates = {
                        y: snapToGrid(startPosY + deltaY),
                        width: Math.max(50, snapToGrid(startWidth + deltaX)),
                        height: Math.max(30, snapToGrid(startHeight - deltaY))
                    };
                    break;
                case 'nw':
                    updates = {
                        x: snapToGrid(startPosX + deltaX),
                        y: snapToGrid(startPosY + deltaY),
                        width: Math.max(50, snapToGrid(startWidth - deltaX)),
                        height: Math.max(30, snapToGrid(startHeight - deltaY))
                    };
                    break;
                case 'e':
                    updates = { width: Math.max(50, snapToGrid(startWidth + deltaX)) };
                    break;
                case 'w':
                    updates = {
                        x: snapToGrid(startPosX + deltaX),
                        width: Math.max(50, snapToGrid(startWidth - deltaX))
                    };
                    break;
                case 'n':
                    updates = {
                        y: snapToGrid(startPosY + deltaY),
                        height: Math.max(30, snapToGrid(startHeight - deltaY))
                    };
                    break;
                case 's':
                    updates = { height: Math.max(30, snapToGrid(startHeight + deltaY)) };
                    break;
            }

            if (isSection && item.type !== 'subsection' && !item.parentSection) {
                const newX = updates.x !== undefined ? updates.x : item.x;
                const newY = updates.y !== undefined ? updates.y : item.y;
                const newWidth = updates.width !== undefined ? updates.width : item.width;
                const newHeight = updates.height !== undefined ? updates.height : item.height;

                if (checkSectionOverlap(id, newX, newY, newWidth, newHeight, resizeExcludeIds)) {
                    return;
                }
            }

            if (isSection) {
                updateSection(id, updates);
            } else {
                updateElement(id, updates);
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return {
        isDragging,
        draggingSectionId,
        selectionBox,
        handleCanvasMouseDown,
        handleCanvasDoubleClick,
        handleItemMouseDown,
        handleResizeMouseDown
    };
}