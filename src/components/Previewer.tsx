// ── Helpers ──────────────────────────────────────────────────────────────────

const nestedToFlat = (nestedData: any) => {
    const elements: any[] = [...(nestedData.elements || [])];
    const sections: any[] = [];

    (nestedData.sections || []).forEach((section: any) => {
        const { 'sub-sections': subsections, elements: sectionElements, backgroundColor, borderColor, direction, ...sectionData } = section;
        sections.push(sectionData);

        (sectionElements || []).forEach((el: any) => {
            elements.push({ ...el, x: el.x + section.x, y: el.y + section.y, parentSection: section.id });
        });

        (subsections || []).forEach((ss: any) => {
            const { elements: subEls, backgroundColor: _bg, borderColor: _bc, direction: _dir, ...ssData } = ss;
            sections.push({ ...ssData, type: 'subsection', x: ssData.x + section.x, y: ssData.y + section.y, parentSection: section.id });
            (subEls || []).forEach((el: any) => {
                elements.push({ ...el, x: el.x + ssData.x + section.x, y: el.y + ssData.y + section.y, parentSection: ss.id });
            });
        });
    });

    return { elements, sections };
};

// ── Renderer ─────────────────────────────────────────────────────────────────

const TemplateRenderer = ({ data, scale }: { data: any; scale: number }) => {
    const { elements, sections } = nestedToFlat(data || {});

    const getBulletMarker = (style: string, index: number): string => {
        const toRoman = (n: number): string => {
            const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
            const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
            let r = '';
            vals.forEach((v, i) => { while (n >= v) { r += syms[i]; n -= v; } });
            return r.toLowerCase();
        };
        switch (style) {
            case 'disc':     return '\u2022';
            case 'circle':   return '\u25CB';
            case 'square':   return '\u25A0';
            case 'dash':     return '\u2013';
            case 'numbered': return `${index + 1}.`;
            case 'roman':    return `${toRoman(index + 1)}.`;
            case 'none':     return '';
            default:         return '\u2022';
        }
    };

    const renderContent = (el: any) => {
        if (el.type === 'line-break') {
            return (
                <div style={{
                    width: `${el.lineBreakWidthPercent || 100}%`,
                    height: 0,
                    borderTop: `${Math.max(1, (el.lineBreakThickness || 1) * scale)}px ${el.lineBreakStyle || 'solid'} ${el.lineBreakColor || '#d1d5db'}`,
                }} />
            );
        }
        if (el.type === 'bullets') {
            const items: string[] = el.bulletItems || [];
            const columns: number = el.columns || 1;
            const bulletStyle: string = el.bulletStyle || 'disc';
            return (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: `${3 * scale}px ${12 * scale}px`,
                    width: '100%',
                }}>
                    {items.map((item, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: `${5 * scale}px`,
                            fontSize: `${(el.fontSize || 12) * scale}px`,
                            fontWeight: el.fontWeight || 'normal',
                            fontFamily: el.fontFamily || 'Arial',
                            color: el.color || '#000000',
                            lineHeight: el.lineHeight || 1.5,
                            wordBreak: 'break-word' as const,
                        }}>
                            <span style={{ flexShrink: 0, minWidth: `${14 * scale}px`, marginTop: `${1 * scale}px` }}>
                                {getBulletMarker(bulletStyle, i)}
                            </span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return el.content;
    };

    const elStyle = (el: any) => ({
        position: 'absolute' as const,
        left: `${el.x * scale}px`,
        top: `${el.y * scale}px`,
        width: `${el.width * scale}px`,
        height: `${el.height * scale}px`,
        // overflow: 'hidden' as const,
        ...(el.type === 'line-break' ? {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        } : el.type === 'bullets' ? {
            boxSizing: 'border-box' as const,
        } : {
            fontSize: `${(el.fontSize || 16) * scale}px`,
            fontWeight: el.fontWeight || 'normal',
            fontFamily: el.fontFamily || 'Arial',
            color: el.color || '#000000',
            textAlign: (el.textAlign || 'left') as any,
            lineHeight: el.lineHeight || 1.5,
            whiteSpace: 'pre-wrap' as const,
            wordWrap: 'break-word' as const,
        }),
    });

    return (
        <>
            {sections.filter((s: any) => !s.parentSection).map((section: any) => {
                const subsections = sections.filter((s: any) => s.parentSection === section.id);
                return (
                    <div key={section.id} style={{ position: 'absolute', left: `${section.x * scale}px`, top: `${section.y * scale}px`, width: `${section.width * scale}px`, height: `${section.height * scale}px`, boxSizing: 'border-box' }}>
                        {section.title && section.headerVisible !== false && (
                            <div style={{ fontSize: `${(section.headerFontSize || 18) * scale}px`, fontWeight: section.headerFontWeight || '700', fontFamily: section.headerFontFamily || 'Arial', color: section.headerColor || '#1f2937', marginBottom: `${1 * scale}px` }}>
                                {section.title}
                            </div>
                        )}
                        {subsections.map((ss: any) => (
                            <div key={ss.id} style={{ position: 'absolute', left: `${(ss.x - section.x) * scale}px`, top: `${(ss.y - section.y) * scale}px`, width: `${ss.width * scale}px`, height: `${ss.height * scale}px` }}>
                                {elements.filter((el: any) => el.parentSection === ss.id).map((el: any) => (
                                    <div key={el.id} style={{ ...elStyle(el), left: `${(el.x - ss.x) * scale}px`, top: `${(el.y - ss.y) * scale}px` }}>
                                        {renderContent(el)}
                                    </div>
                                ))}
                            </div>
                        ))}
                        {elements.filter((el: any) => el.parentSection === section.id && !subsections.some((ss: any) => ss.id === el.parentSection)).map((el: any) => (
                            <div key={el.id} style={{ ...elStyle(el), left: `${(el.x - section.x) * scale}px`, top: `${(el.y - section.y) * scale}px` }}>
                                {renderContent(el)}
                            </div>
                        ))}
                    </div>
                );
            })}
            {elements.filter((el: any) => !el.parentSection).map((el: any) => (
                <div key={el.id} style={elStyle(el)}>{renderContent(el)}</div>
            ))}
        </>
    );
};

// ── Previewer ─────────────────────────────────────────────────────────────────

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 96 / 25.4;

interface PreviewerProps {
    data: any;
    width: number;
}

const Previewer = ({ data, width }: PreviewerProps) => {
    const canvasWidth = data?.canvasSettings?.width
        ? parseFloat(data.canvasSettings.width) * MM_TO_PX
        : A4_WIDTH_MM * MM_TO_PX;
    const canvasHeight = data?.canvasSettings?.height
        ? parseFloat(data.canvasSettings.height) * MM_TO_PX
        : A4_HEIGHT_MM * MM_TO_PX;
    const scale = width / canvasWidth;
    const height = canvasHeight * scale;

    return (
        <div
            className="relative bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200"
            style={{ width: `${width}px`, height: `${height}px` }}
        >
            <TemplateRenderer data={data} scale={scale} />
        </div>
    );
};

export default Previewer;