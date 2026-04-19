import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Toolbar from './Toolbar.tsx';
import EditDrawer from './Drawer.tsx';
import CanvasSection from './Section.tsx';
import CanvasElement from './Element.tsx';
import BuilderTopBar from './BuilderTopBar.tsx';
import { CANVAS_SIZES } from './constants';
import { nestedToFlat } from './utils/transformUtils';
import { useSelectionDrawer } from './hooks/useSelectionDrawer';
import { useCanvasInteractions } from './hooks/useCanvasInteractions';
import { useSectionActions } from './hooks/useSectionActions';
import { useTemplateActions } from './hooks/useTemplateActions';
import { useLandingTheme } from '@hooks/useLandingTheme.ts';
import { templateService } from '@src/services/template.service';
import { resumeService } from '@src/services/resume.service';


function ResumeBuilder() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const mode = location.pathname.startsWith('/edit/') ? 'resume' : 'template';
    const [sections, setSections] = useState([]);
    const [elements, setElements] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [templateName, setTemplateName] = useState('Untitled Resume');
    const [templateCategory, setTemplateCategory] = useState('Other');
    const [templateId, setTemplateId] = useState(null);
    const [templateVisibility, setTemplateVisibility] = useState('private');
    const [templateStatus, setTemplateStatus] = useState('draft');
    const [canvasSize, setCanvasSize] = useState('A4');
    const [customWidth, setCustomWidth] = useState('210mm');
    const [customHeight, setCustomHeight] = useState('297mm');
    const [margins, setMargins] = useState({ top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 });
    const [scale, setScale] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [gridSize] = useState(4);
    const canvasRef = useRef(null);

    // Activate --rc-* CSS custom properties for all child components
    const theme = useLandingTheme();

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
        isSaving, isExporting, isPublishing, saveTemplate, updateTemplate, loadTemplate, exportToPDF, getTemplateJSON, publishTemplate
    } = useTemplateActions({
        elements, sections, templateName, templateCategory, canvasSize, customWidth, customHeight, margins, templateId,
        setElements, setSections, setTemplateName, setTemplateCategory, setTemplateId, setCanvasSize, setCustomWidth, setCustomHeight, setMargins, setSelectedIds,
        setTemplateVisibility, setTemplateStatus,
        mode,
    });

    // --- Auto-resize element + cascade to parent section ---

    const onAutoResize = (elementId, newHeight) => {
        updateElement(elementId, { height: newHeight });

        const el = elements.find(e => e.id === elementId);
        if (!el || !el.parentSection) return;

        const cascadeSection = (sectionId) => {
            const sec = sections.find(s => s.id === sectionId);
            if (!sec) return;

            const childElements = elements.map(e => {
                if (e.parentSection !== sectionId) return null;
                const h = e.id === elementId ? newHeight : e.height;
                return (e.y - sec.y) + h;
            }).filter(Boolean);

            const childSubsections = sections
                .filter(s => s.parentSection === sectionId)
                .map(s => (s.y - sec.y) + s.height);

            const allBottoms = [...childElements, ...childSubsections];
            if (allBottoms.length === 0) return;

            const maxBottom = Math.max(...allBottoms);
            const newSectionHeight = maxBottom + 20;

            if (Math.abs(newSectionHeight - sec.height) > 1) {
                updateSection(sectionId, { height: newSectionHeight });
                if (sec.parentSection) cascadeSection(sec.parentSection);
            }
        };

        cascadeSection(el.parentSection);
    };

    // --- Delete selected items ---

    const deleteSelected = () => {
        const idsToDelete = new Set(selectedIds);

        selectedIds.forEach(id => {
            elements.forEach(el => {
                if (el.parentSection === id) idsToDelete.add(el.id);
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
        if (id) {
            const loader = mode === 'resume' ? resumeService.get(id) : templateService.get(id);
            loader.then(template => {
                const settings = template.data.canvasSettings;
                const { elements: flatElements, sections: flatSections } = nestedToFlat(template.data, settings);
                setElements(flatElements || []);
                setSections(flatSections || []);
                setTemplateName(template.name);
                setTemplateCategory(template.category || 'Other');
                setTemplateVisibility((template as any).visibility || 'private');
                setTemplateStatus((template as any).status || 'draft');
                setTemplateId(template.id || id);
                setCanvasSize(settings?.size || 'A4');
                setCustomWidth(settings?.width || CANVAS_SIZES[settings?.size || 'A4'].width);
                setCustomHeight(settings?.height || CANVAS_SIZES[settings?.size || 'A4'].height);
                if (settings?.margins) setMargins(settings.margins);
                setSelectedIds([]);
            }).catch(err => {
                console.error(`Error loading ${mode}:`, err);
            });
        }
    }, [id]);

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

    // const handleCustomWidthChange = (val) => { setCustomWidth(val); setCanvasSize('Custom'); };
    // const handleCustomHeightChange = (val) => { setCustomHeight(val); setCanvasSize('Custom'); };

    const currentCanvasSize = { width: customWidth, height: customHeight };
    const hasMargins = margins.top > 0 || margins.right > 0 || margins.bottom > 0 || margins.left > 0;

    // Theme-derived canvas workspace colors
    const wsBg    = theme.isDark ? '#111827' : '#e4e9f0';
    const wsDot   = theme.isDark ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.065)';

    // --- Render ---

    return (
        <div
            className="relative overflow-auto"
            style={{
                minHeight: '100vh',
                backgroundColor: wsBg,
                backgroundImage: `radial-gradient(circle, ${wsDot} 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
            }}
        >
            <style>{`
                .canvas-paper {
                    box-shadow:
                        0 0 0 1px rgba(0,0,0,0.04),
                        0 4px 16px rgba(0,0,0,0.07),
                        0 14px 48px rgba(0,0,0,0.10);
                }
                .canvas-paper::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 2px;
                    pointer-events: none;
                    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
                    z-index: 1;
                }
                .margin-rect {
                    position: absolute;
                    pointer-events: none;
                    z-index: 5;
                    border: 1.5px dashed color-mix(in srgb, var(--rc-accent, #638cff) 45%, transparent);
                    border-radius: 1px;
                }
                .selection-box {
                    border: 1.5px dashed var(--rc-accent, #3b82f6);
                    background-color: color-mix(in srgb, var(--rc-accent, #3b82f6) 6%, transparent);
                    border-radius: 2px;
                    pointer-events: none;
                    z-index: 9999;
                }
            `}</style>

            <BuilderTopBar
                templateName={templateName}
                onTemplateNameChange={setTemplateName}
                templateCategory={templateCategory}
                onTemplateCategoryChange={setTemplateCategory}
                canvasSize={canvasSize}
                onCanvasSizeChange={handleCanvasSizeChange}
                canvasSizes={CANVAS_SIZES}
                templateId={templateId}
                templateVisibility={templateVisibility as any}
                templateStatus={templateStatus as any}
                isSaving={isSaving}
                isExporting={isExporting}
                isPublishing={isPublishing}
                onSave={saveTemplate}
                onUpdate={updateTemplate}
                onExportPDF={exportToPDF}
                onPublish={publishTemplate}
                onPreview={() => window.open(`/preview/${templateId}`, '_blank')}
                mode={mode}
            />

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
                onAddSection={addSection}
                onSave={saveTemplate}
                onCopyJSON={getTemplateJSON}
                selectedCount={selectedIds.length}
                isSaving={isSaving}
                margins={margins}
                onMarginsChange={setMargins}
                scale={scale}
                onScaleChange={setScale}
                showGrid={showGrid}
                onToggleGrid={() => setShowGrid(prev => !prev)}
            />

            {/* ── Canvas Area ── */}
            <div className="flex justify-center pt-[72px] pb-16">
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
                                `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                                 linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
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

        </div>
    );
}

export default ResumeBuilder;
