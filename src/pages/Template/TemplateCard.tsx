import { Loader2, Pencil, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TemplateCard = ({ template, onLoad, onDelete, isLoading = false }) => {
    const navigate = useNavigate();
    const { data } = template;

    // Transform nested format to flat format for rendering
    const nestedToFlat = (nestedData) => {
        const elements = [...(nestedData.elements || [])];
        const sections = [];

        (nestedData.sections || []).forEach(section => {
            const { 'sub-sections': subsections, elements: sectionElements, backgroundColor, borderColor, direction, ...sectionData } = section;
            sections.push(sectionData);

            if (sectionElements && sectionElements.length > 0) {
                sectionElements.forEach(el => {
                    elements.push({
                        ...el,
                        x: el.x + section.x,
                        y: el.y + section.y,
                        parentSection: section.id
                    });
                });
            }

            if (subsections && subsections.length > 0) {
                subsections.forEach(subsection => {
                    const { elements: subElements, backgroundColor: _bg, borderColor: _bc, direction: _dir, ...subsectionData } = subsection;

                    sections.push({
                        ...subsectionData,
                        type: 'subsection',
                        x: subsectionData.x + section.x,
                        y: subsectionData.y + section.y,
                        parentSection: section.id
                    });

                    if (subElements && subElements.length > 0) {
                        subElements.forEach(el => {
                            elements.push({
                                ...el,
                                x: el.x + subsectionData.x + section.x,
                                y: el.y + subsectionData.y + section.y,
                                parentSection: subsection.id
                            });
                        });
                    }
                });
            }
        });

        return { elements, sections };
    };

    const { elements, sections } = nestedToFlat(data || {});
    const { canvasSettings = {} } = data || {};

    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const A4_ASPECT_RATIO = A4_HEIGHT_MM / A4_WIDTH_MM;

    const previewWidth = 330;
    const previewHeight = previewWidth * A4_ASPECT_RATIO;

    const canvasWidth = canvasSettings?.width
        ? parseFloat(canvasSettings.width) * 96 / 25.4
        : A4_WIDTH_MM * 96 / 25.4;
    const canvasHeight = canvasSettings?.height
        ? parseFloat(canvasSettings.height) * 96 / 25.4
        : A4_HEIGHT_MM * 96 / 25.4;

    const scale = previewWidth / canvasWidth;

    const renderElementContent = (el) => {
        if (el.type === 'line-break') {
            return (
                <div style={{
                    width: `${el.lineBreakWidthPercent || 100}%`,
                    height: 0,
                    borderTop: `${Math.max(1, (el.lineBreakThickness || 1) * scale)}px ${el.lineBreakStyle || 'solid'} ${el.lineBreakColor || '#d1d5db'}`,
                }} />
            );
        }
        return el.content;
    };

    const renderElement = (el) => {
        const isLineBreak = el.type === 'line-break';
        const style = {
            position: 'absolute',
            left: `${el.x * scale}px`,
            top: `${el.y * scale}px`,
            width: `${el.width * scale}px`,
            height: `${el.height * scale}px`,
            ...(isLineBreak ? {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            } : {
                fontSize: `${(el.fontSize || 16) * scale}px`,
                fontWeight: el.fontWeight || 'normal',
                fontFamily: el.fontFamily || 'Arial',
                color: el.color || '#000000',
                textAlign: el.textAlign || 'left',
                lineHeight: el.lineHeight || 1.5,
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
            })
        };

        return (
            <div key={el.id} style={style}>
                {renderElementContent(el)}
            </div>
        );
    };

    const renderSection = (section) => {
        if (section.parentSection) return null;

        const style = {
            position: 'absolute',
            left: `${section.x * scale}px`,
            top: `${section.y * scale}px`,
            width: `${section.width * scale}px`,
            height: `${section.height * scale}px`,
            boxSizing: 'border-box',
            padding: `${2 * scale}px`
        };

        const subsections = sections.filter(s => s.parentSection === section.id);

        return (
            <div key={section.id} style={style}>
                {section.title && section.headerVisible !== false && (
                    <div style={{
                        fontSize: `${(section.headerFontSize || 18) * scale}px`,
                        fontWeight: section.headerFontWeight || '700',
                        fontFamily: section.headerFontFamily || 'Arial',
                        color: section.headerColor || '#1f2937',
                        textAlign: section.headerTextAlign || 'left',
                        lineHeight: section.headerLineHeight || 1.2,
                        marginBottom: `${1 * scale}px`,
                        padding: `${2 * scale}px`
                    }}>
                        {section.title}
                    </div>
                )}

                {subsections.map(subsection => (
                    <div
                        key={subsection.id}
                        style={{
                            position: 'absolute',
                            left: `${(subsection.x - section.x) * scale}px`,
                            top: `${(subsection.y - section.y) * scale}px`,
                            width: `${subsection.width * scale}px`,
                            height: `${subsection.height * scale}px`,
                            boxSizing: 'border-box'
                        }}
                    >
                        {elements
                            .filter(el => el.parentSection === subsection.id)
                            .map(el => (
                                <div
                                    key={el.id}
                                    style={{
                                        position: 'absolute',
                                        left: `${(el.x - subsection.x) * scale}px`,
                                        top: `${(el.y - subsection.y) * scale}px`,
                                        width: `${el.width * scale}px`,
                                        height: `${el.height * scale}px`,
                                        ...(el.type === 'line-break' ? {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        } : {
                                            fontSize: `${(el.fontSize || 16) * scale}px`,
                                            fontWeight: el.fontWeight || 'normal',
                                            fontFamily: el.fontFamily || 'Arial',
                                            color: el.color || '#000000',
                                            textAlign: el.textAlign || 'left',
                                            lineHeight: el.lineHeight || 1.5,
                                            overflow: 'hidden',
                                            whiteSpace: 'pre-wrap',
                                            wordWrap: 'break-word',
                                        })
                                    }}
                                >
                                    {renderElementContent(el)}
                                </div>
                            ))}
                    </div>
                ))}

                {elements
                    .filter(el => {
                        if (el.parentSection !== section.id) return false;
                        const belongsToSubsection = subsections.some(sub => el.parentSection === sub.id);
                        return !belongsToSubsection;
                    })
                    .map(el => (
                        <div
                            key={el.id}
                            style={{
                                position: 'absolute',
                                left: `${(el.x - section.x) * scale}px`,
                                top: `${(el.y - section.y) * scale}px`,
                                width: `${el.width * scale}px`,
                                height: `${el.height * scale}px`,
                                ...(el.type === 'line-break' ? {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                } : {
                                    fontSize: `${(el.fontSize || 16) * scale}px`,
                                    fontWeight: el.fontWeight || 'normal',
                                    fontFamily: el.fontFamily || 'Arial',
                                    color: el.color || '#000000',
                                    textAlign: el.textAlign || 'left',
                                    lineHeight: el.lineHeight || 1.5,
                                    overflow: 'hidden',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                })
                            }}
                        >
                            {renderElementContent(el)}
                        </div>
                    ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">

            {/* Preview area */}
            <div
                onClick={() => { if (!isLoading) onLoad(template); }}
                className="relative w-full overflow-hidden border-b border-gray-100 bg-white"
                style={{ height: `${previewHeight}px` }}
            >
                {/* Scaled resume content — positions are computed, must stay inline */}
                {sections.map(section => renderSection(section))}
                {elements
                    .filter(el => !el.parentSection)
                    .map(el => renderElement(el))}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-200 pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 px-5 py-2 bg-white rounded-lg text-sm font-semibold text-gray-900 shadow-lg">
                        Open in Builder
                    </span>
                </div>
            </div>

            {/* Card info */}
            <div className="p-3.5">
                <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                    {template.name}
                </h3>

                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">
                        {formatDate(template.updatedAt)}
                    </span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                        {elements.length} elements
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/templates/${template._id}/preview`);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-md transition-colors duration-150 active:scale-95"
                    >
                        <Eye className="size-3" />
                        View
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isLoading) onLoad(template);
                        }}
                        disabled={isLoading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 text-xs font-semibold rounded-md transition-colors duration-150 active:scale-95"
                    >
                        {isLoading
                            ? <Loader2 className="size-3 animate-spin" />
                            : <Pencil className="size-3" />
                        }
                        {isLoading ? 'Loading…' : 'Edit'}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete "${template.name}"?`)) {
                                onDelete(template._id);
                            }
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold rounded-md border border-red-200 hover:border-red-500 transition-all duration-150 active:scale-95"
                    >
                        <Trash2 className="size-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateCard;
