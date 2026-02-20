import { useState } from 'react';

export function useCanvasInteractions({
    sections, elements, selectedIds, scale, showGrid, gridSize, canvasRef,
    setSections, setElements, setSelectedIds, updateSection, updateElement
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectionBox, setSelectionBox] = useState(null);

    const snapToGrid = (value) => {
        if (!showGrid) return value;
        return Math.round(value / gridSize) * gridSize;
    };

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

    // Find sections that already overlap with a given section at its current position
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
        setIsDragging(true);

        const startX = e.clientX;
        const startY = e.clientY;

        let itemsToMove = new Set(selectedIds);

        // Recursively collect all children (subsections and elements)
        const collectChildren = (parentId) => {
            elements.forEach(el => {
                if (el.parentSection === parentId) {
                    itemsToMove.add(el.id);
                }
            });
            sections.forEach(sec => {
                if (sec.parentSection === parentId) {
                    itemsToMove.add(sec.id);
                    collectChildren(sec.id);
                }
            });
        };

        selectedIds.forEach(selectedId => {
            collectChildren(selectedId);
        });

        const initialPositions = new Map();

        itemsToMove.forEach(itemId => {
            const section = sections.find(s => s.id === itemId);
            const element = elements.find(el => el.id === itemId);

            if (section) {
                initialPositions.set(itemId, { x: section.x, y: section.y });
            } else if (element) {
                initialPositions.set(itemId, { x: element.x, y: element.y });
            }
        });

        // Find sections already overlapping at drag start so we can exclude them
        // This allows dragging sections apart even if they currently overlap
        const alreadyOverlapping = new Set();
        selectedIds.forEach(selectedId => {
            const overlaps = getAlreadyOverlapping(selectedId);
            overlaps.forEach(oid => alreadyOverlapping.add(oid));
        });

        const handleMouseMove = (moveEvent) => {
            const deltaX = (moveEvent.clientX - startX) / scale;
            const deltaY = (moveEvent.clientY - startY) / scale;

            // Snap the primary dragged item to get a consistent offset for all items
            const primaryPos = initialPositions.get(id);
            const snappedPrimaryX = snapToGrid(primaryPos.x + deltaX);
            const snappedPrimaryY = snapToGrid(primaryPos.y + deltaY);
            const snappedDeltaX = snappedPrimaryX - primaryPos.x;
            const snappedDeltaY = snappedPrimaryY - primaryPos.y;

            itemsToMove.forEach(itemId => {
                const initialPos = initialPositions.get(itemId);
                if (!initialPos) return;

                const newX = initialPos.x + snappedDeltaX;
                const newY = initialPos.y + snappedDeltaY;

                const section = sections.find(s => s.id === itemId);

                if (section) {
                    // Check overlap for main sections (skip sections already overlapping at drag start)
                    if (section.type !== 'subsection' && !section.parentSection) {
                        if (checkSectionOverlap(itemId, newX, newY, section.width, section.height, alreadyOverlapping)) {
                            return; // Don't move if overlap
                        }
                    }

                    setSections(prev => prev.map(sec =>
                        sec.id === itemId ? { ...sec, x: newX, y: newY } : sec
                    ));
                } else {
                    setElements(prev => prev.map(el =>
                        el.id === itemId ? { ...el, x: newX, y: newY } : el
                    ));
                }
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

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

        // Exclude sections already overlapping at resize start
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

            // Check overlap for sections
            if (isSection && item.type !== 'subsection' && !item.parentSection) {
                const newX = updates.x !== undefined ? updates.x : item.x;
                const newY = updates.y !== undefined ? updates.y : item.y;
                const newWidth = updates.width !== undefined ? updates.width : item.width;
                const newHeight = updates.height !== undefined ? updates.height : item.height;

                if (checkSectionOverlap(id, newX, newY, newWidth, newHeight, resizeExcludeIds)) {
                    return; // Don't resize if it would cause overlap
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
        selectionBox,
        handleCanvasMouseDown,
        handleCanvasDoubleClick,
        handleItemMouseDown,
        handleResizeMouseDown
    };
}
