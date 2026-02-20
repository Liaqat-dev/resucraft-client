const TemplateCard = ({ template, onLoad, onDelete }) => {
    const { data } = template;

    // Transform nested format to flat format for rendering
    const nestedToFlat = (nestedData) => {
        const elements = [...(nestedData.elements || [])];
        const sections = [];

        (nestedData.sections || []).forEach(section => {
            const { 'sub-sections': subsections, elements: sectionElements, backgroundColor, borderColor, direction, ...sectionData } = section;
            sections.push(sectionData);

            // Process section's direct elements
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

            // Process subsections
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

    // Calculate scale to maintain A4 aspect ratio
    // A4 dimensions: 210mm x 297mm (aspect ratio 1:1.414)
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const A4_ASPECT_RATIO = A4_HEIGHT_MM / A4_WIDTH_MM; // ~1.414

    // Card preview dimensions (maintaining A4 ratio)
    const previewWidth = 330; // px
    const previewHeight = previewWidth * A4_ASPECT_RATIO; // ~396px

    // Get actual canvas dimensions in pixels (convert mm to px: 1mm = 96/25.4 px)
    const canvasWidth = canvasSettings?.width
        ? parseFloat(canvasSettings.width) * 96 / 25.4
        : A4_WIDTH_MM * 96 / 25.4; // ~794px
    const canvasHeight = canvasSettings?.height
        ? parseFloat(canvasSettings.height) * 96 / 25.4
        : A4_HEIGHT_MM * 96 / 25.4; // ~1123px

    // Calculate scale factor
    const scale = previewWidth / canvasWidth;

    // Render element inner content
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

    // Render a mini element
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

    // Render a mini section
    const renderSection = (section) => {
        if (section.parentSection) return null; // Skip subsections, they'll be rendered by parent

        const style = {
            position: 'absolute',
            left: `${section.x * scale}px`,
            top: `${section.y * scale}px`,
            width: `${section.width * scale}px`,
            height: `${section.height * scale}px`,
            // backgroundColor: section.backgroundColor || '#f9fafb',
            // border: `1px solid ${section.borderColor || '#9ca3af'}`,
            // borderRadius: '1px',
            boxSizing: 'border-box',
            padding: `${2 * scale}px`
        };

        // Get subsections
        const subsections = sections.filter(s => s.parentSection === section.id);

        return (
            <div key={section.id} style={style}>
                {/* Section Title */}
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

                {/* Render subsections */}
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
                        {/* Render elements in subsection */}
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

                {/* Render elements directly in section */}
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
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
            cursor: 'pointer',
            ':hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)'
            }
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
            {/* Preview */}
            <div
                onClick={() => onLoad(template)}
                style={{
                    width: '100%',
                    height: `${previewHeight}px`,
                    backgroundColor: '#ffffff',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid #e5e7eb'
                }}
            >
                {/* Render sections */}
                {sections.map(section => renderSection(section))}

                {/* Render root elements (no parent section) */}
                {elements
                    .filter(el => !el.parentSection)
                    .map(el => renderElement(el))}
            </div>

             {/*Info */}
            <div style={{ padding: '12px' }}>
                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {template.name}
                </h3>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '12px'
                }}>
                    <span>Updated {formatDate(template.updatedAt)}</span>
                    <span>{elements.length} elements</span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onLoad(template);
                        }}
                        style={{
                            flex: 1,
                            padding: '8px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                        Load
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete "${template.name}"?`)) {
                                onDelete(template._id);
                            }
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateCard;
