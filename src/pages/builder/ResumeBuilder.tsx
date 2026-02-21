import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './Toolbar.tsx';
import EditDrawer from './Drawer.tsx';
import CanvasSection from './Section.tsx';
import CanvasElement from './Element.tsx';
import { CANVAS_SIZES } from './constants';
import { nestedToFlat } from './utils/transformUtils';
import { useSelectionDrawer } from './hooks/useSelectionDrawer';
import { useCanvasInteractions } from './hooks/useCanvasInteractions';
import { useSectionActions } from './hooks/useSectionActions';
import { useTemplateActions } from './hooks/useTemplateActions';

/* ─── Icons ─── */

const IconDownload = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const IconFileText = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
);

function ResumeBuilder() {
    const [sections, setSections] = useState([]);
    const [elements, setElements] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [templateName, setTemplateName] = useState('Untitled Resume');
    const [templateId, setTemplateId] = useState(null);
    const [canvasSize, setCanvasSize] = useState('A4');
    const [customWidth, setCustomWidth] = useState('210mm');
    const [customHeight, setCustomHeight] = useState('297mm');
    const [margins, setMargins] = useState({ top: 1, right: 1, bottom: 1, left: 1 });
    const [scale, setScale] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [gridSize] = useState(4);
    const canvasRef = useRef(null);

    // --- Hooks ---

    const {
        isDrawerOpen, editingElement, selectedHeaderSectionId,
        setEditingElement, handleHeaderClick, closeDrawer
    } = useSelectionDrawer({ selectedIds, setSelectedIds, elements, sections });

    const updateElement = (id, updates) => {
        setElements(prev => prev.map(el =>
            el.id === id ? { ...el, ...updates } : el
        ));
        if (editingElement && editingElement.id === id) {
            setEditingElement(prev => ({ ...prev, ...updates }));
        }
    };

    const updateSection = (id, updates) => {
        setSections(prev => prev.map(sec =>
            sec.id === id ? { ...sec, ...updates } : sec
        ));
        if (editingElement && editingElement.id === id) {
            setEditingElement(prev => ({ ...prev, ...updates }));
        }
    };

    const {
        isDragging, draggingSectionId, selectionBox,
        handleCanvasMouseDown, handleCanvasDoubleClick,
        handleItemMouseDown, handleResizeMouseDown
    } = useCanvasInteractions({
        sections, elements, selectedIds, scale, showGrid, gridSize, canvasRef,
        setSections, setElements, setSelectedIds, updateSection, updateElement
    });

    const { addSection, addSubsection, addContentToSection } = useSectionActions({
        sections, elements, margins, customWidth,
        setSections, setElements, setSelectedIds, updateSection
    });

    const {
        isSaving, saveTemplate, updateTemplate, loadTemplate, exportToPDF, getTemplateJSON
    } = useTemplateActions({
        elements, sections, templateName, canvasSize, customWidth, customHeight, margins, templateId,
        setElements, setSections, setTemplateName, setTemplateId, setCanvasSize, setCustomWidth, setCustomHeight, setMargins, setSelectedIds
    });

    // --- Auto-resize element + cascade to parent section ---

    const onAutoResize = (elementId, newHeight) => {
        // Update the element's height
        updateElement(elementId, { height: newHeight });

        // Find the element to get its parent section
        const el = elements.find(e => e.id === elementId);
        if (!el || !el.parentSection) return;

        const cascadeSection = (sectionId) => {
            const sec = sections.find(s => s.id === sectionId);
            if (!sec) return;

            // Find all child elements in this section
            const childElements = elements.map(e => {
                if (e.parentSection !== sectionId) return null;
                const h = e.id === elementId ? newHeight : e.height;
                return (e.y - sec.y) + h;
            }).filter(Boolean);

            // Find all child subsections in this section
            const childSubsections = sections
                .filter(s => s.parentSection === sectionId)
                .map(s => (s.y - sec.y) + s.height);

            const allBottoms = [...childElements, ...childSubsections];
            if (allBottoms.length === 0) return;

            const maxBottom = Math.max(...allBottoms);
            const newSectionHeight = maxBottom + 20; // 20px padding

            if (Math.abs(newSectionHeight - sec.height) > 1) {
                updateSection(sectionId, { height: newSectionHeight });

                // Cascade to parent section if this section is nested
                if (sec.parentSection) {
                    cascadeSection(sec.parentSection);
                }
            }
        };

        cascadeSection(el.parentSection);
    };

    // --- Delete selected items ---

    const deleteSelected = () => {
        const idsToDelete = new Set(selectedIds);

        selectedIds.forEach(id => {
            elements.forEach(el => {
                if (el.parentSection === id) {
                    idsToDelete.add(el.id);
                }
            });
            sections.forEach(sec => {
                if (sec.parentSection === id) {
                    idsToDelete.add(sec.id);
                    const getChildrenRecursive = (parentId) => {
                        elements.forEach(el => {
                            if (el.parentSection === parentId) idsToDelete.add(el.id);
                        });
                        sections.forEach(sec => {
                            if (sec.parentSection === parentId) {
                                idsToDelete.add(sec.id);
                                getChildrenRecursive(sec.id);
                            }
                        });
                    };
                    getChildrenRecursive(sec.id);
                }
            });
        });

        setElements(prev => prev.filter(el => !idsToDelete.has(el.id)));
        setSections(prev => prev.filter(sec => !idsToDelete.has(sec.id)));
        setSelectedIds([]);
        closeDrawer();
    };

    // --- Effects ---

    useEffect(() => {
        const templateToLoad = localStorage.getItem('templateToLoad');
        if (templateToLoad) {
            try {
                const template = JSON.parse(templateToLoad);
                const settings = template.data.canvasSettings;
                const { elements: nestedElements, sections: nestedSections } = nestedToFlat(template.data, settings);

                setElements(nestedElements || []);
                setSections(nestedSections || []);
                setTemplateName(template.name);
                setTemplateId(template._id || null);
                setCanvasSize(settings?.size || 'A4');
                setCustomWidth(settings?.width || CANVAS_SIZES[settings?.size || 'A4'].width);
                setCustomHeight(settings?.height || CANVAS_SIZES[settings?.size || 'A4'].height);
                if (settings?.margins) setMargins(settings.margins);
                setSelectedIds([]);

                localStorage.removeItem('templateToLoad');
            } catch (err) {
                console.error('Error loading template:', err);
                localStorage.removeItem('templateToLoad');
            }
        }
    }, []);

    // Keep all section/subsection widths in sync with canvas settings
    useEffect(() => {
        setSections(prev => {
            if (prev.length === 0) return prev;
            const canvasWidthPx = parseFloat(customWidth) * (96 / 25.4);
            const marginLeftPx = margins.left * 96;
            const marginRightPx = margins.right * 96;
            const sectionWidth = canvasWidthPx - marginLeftPx - marginRightPx;
            return prev.map(sec => ({ ...sec, width: sectionWidth }));
        });
    }, [customWidth, margins]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
                if (document.activeElement.contentEditable === 'true') return;
                if (document.activeElement.tagName === 'INPUT') return;
                if (document.activeElement.tagName === 'TEXTAREA') return;
                deleteSelected();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds]);

    // --- Canvas size handlers ---

    const handleCanvasSizeChange = (newSize) => {
        setCanvasSize(newSize);
        if (newSize !== 'Custom') {
            setCustomWidth(CANVAS_SIZES[newSize].width);
            setCustomHeight(CANVAS_SIZES[newSize].height);
        }
    };

    const handleCustomWidthChange = (val) => {
        setCustomWidth(val);
        setCanvasSize('Custom');
    };
    const handleCustomHeightChange = (val) => {
        setCustomHeight(val);
        setCanvasSize('Custom');
    };

    const currentCanvasSize = { width: customWidth, height: customHeight };

    const hasMargins = margins.top > 0 || margins.right > 0 || margins.bottom > 0 || margins.left > 0;

    // --- Render ---

    return (
        <div className="relative  overflow-auto bg-builder-canvas">
            <style>{`
                .bg-builder-canvas {
                    background-color: #eef1f5;
                    background-image:
                        radial-gradient(circle, #d5dbe3 1px, transparent 1px);
                    background-size: 24px 24px;
                }
                .canvas-paper {
                    box-shadow:
                        0 0 0 1px rgba(0,0,0,0.04),
                        0 4px 16px rgba(0,0,0,0.06),
                        0 12px 40px rgba(0,0,0,0.08);
                }
                .canvas-paper::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 2px;
                    pointer-events: none;
                    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
                    z-index: 1;
                }
                .margin-rect {
                    position: absolute;
                    pointer-events: none;
                    z-index: 5;
                    border: 2px dotted rgba(99, 140, 255, 0.45);
                    border-radius: 1px;
                }
                .selection-box {
                    border: 1.5px dashed #3b82f6;
                    background-color: rgba(59, 130, 246, 0.06);
                    border-radius: 2px;
                    pointer-events: none;
                    z-index: 9999;
                }
            `}</style>

            <EditDrawer
                isOpen={isDrawerOpen}
                editingElement={editingElement}
                selectedHeaderSectionId={selectedHeaderSectionId}
                sections={sections}
                onClose={closeDrawer}
                onUpdateElement={updateElement}
                onUpdateSection={updateSection}
                onDelete={deleteSelected}
            />

            <Toolbar
                templateName={templateName}
                onTemplateNameChange={setTemplateName}
                onAddSection={addSection}
                onSave={saveTemplate}
                onUpdate={updateTemplate}
                templateId={templateId}
                onLoad={loadTemplate}
                onCopyJSON={getTemplateJSON}
                selectedCount={selectedIds.length}
                isSaving={isSaving}
                canvasSize={canvasSize}
                onCanvasSizeChange={handleCanvasSizeChange}
                canvasSizes={CANVAS_SIZES}
                customWidth={customWidth}
                customHeight={customHeight}
                onCustomWidthChange={handleCustomWidthChange}
                onCustomHeightChange={handleCustomHeightChange}
                margins={margins}
                onMarginsChange={setMargins}
                scale={scale}
                onScaleChange={setScale}
                showGrid={showGrid}
                onToggleGrid={() => setShowGrid(prev => !prev)}
                gridSize={gridSize}
            />

            {/* ── Canvas Area ── */}
            <div className="flex justify-center pt-10 pb-10">
                <div
                    ref={canvasRef}
                    onDoubleClick={handleCanvasDoubleClick}
                    onMouseDown={handleCanvasMouseDown}
                    className="canvas-paper relative bg-white rounded-sm"
                    style={{
                        width: currentCanvasSize.width,
                        height: currentCanvasSize.height,
                        cursor: 'crosshair',
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        marginBottom: scale !== 1 ? `calc((${scale} - 1) * -50%)` : undefined,
                        ...(showGrid ? {
                            backgroundImage:
                                `linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px),
                                 linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px)`,
                            backgroundSize: `${gridSize}px ${gridSize}px`
                        } : {})
                    }}
                >
                    {/* Margin Guides */}
                    {hasMargins && (
                        <div
                            className="margin-rect"
                            style={{
                                top: `${margins.top}in`,
                                right: `${margins.right}in`,
                                bottom: `${margins.bottom}in`,
                                left: `${margins.left}in`,
                            }}
                        />
                    )}

                    {/* Sections */}
                    {sections.map((section) => {
                        const isSelected = selectedIds.includes(section.id);
                        const childCount = elements.filter(el => el.parentSection === section.id).length +
                            sections.filter(s => s.parentSection === section.id).length;

                        return (
                            <CanvasSection
                                key={section.id}
                                section={section}
                                childCount={childCount}
                                isSelected={isSelected}
                                isDragging={isDragging}
                                isBeingDragged={draggingSectionId === section.id}
                                isReordering={!!draggingSectionId}
                                isSingleSelection={selectedIds.length === 1}
                                onMouseDown={handleItemMouseDown}
                                onTitleChange={(id, title) => updateSection(id, { title })}
                                onContentTypeChange={(id, contentType) => updateSection(id, { contentType })}

                                onAddContent={addContentToSection}
                                onAddSubsection={addSubsection}
                                onResizeMouseDown={handleResizeMouseDown}
                                onHeaderClick={handleHeaderClick}
                            />
                        );
                    })}

                    {/* Elements */}
                    {elements.map((element) => {
                        const isSelected = selectedIds.includes(element.id);

                        return (
                            <CanvasElement
                                key={element.id}
                                element={element}
                                isSelected={isSelected}
                                isDragging={isDragging}
                                isSingleSelection={selectedIds.length === 1}
                                onMouseDown={handleItemMouseDown}
                                onContentChange={(id, content) => updateElement(id, { content })}
                                onResizeMouseDown={handleResizeMouseDown}
                                onAutoResize={onAutoResize}
                            />
                        );
                    })}

                    {/* Selection Box */}
                    {selectionBox && (
                        <div
                            className="absolute selection-box"
                            style={{
                                left: Math.min(selectionBox.startX, selectionBox.endX),
                                top: Math.min(selectionBox.startY, selectionBox.endY),
                                width: Math.abs(selectionBox.endX - selectionBox.startX),
                                height: Math.abs(selectionBox.endY - selectionBox.startY),
                            }}
                        />
                    )}
                </div>
            </div>

            {/* ── Export FAB ── */}
            <button
                onClick={exportToPDF}
                className="fixed bottom-5 left-5 flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-bold text-white
                    bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                    shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40
                    transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 z-[100]
                    group"
            >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 group-hover:bg-white/25 transition-colors">
                    <IconFileText />
                </span>
                Export PDF
            </button>
        </div>
    );
}

export default ResumeBuilder;
