import { Pencil, Trash2, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const timeAgo = (dateString: string) => {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60)     return 'Just now';
    if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface ResumeCardProps {
    resume: any;
    onDelete?: (id: string) => void;
}

const ResumeCard = ({ resume, onDelete }: ResumeCardProps) => {
    const navigate = useNavigate();
    const resumeId = resume._id ?? resume.id;
    const { data } = resume;

    /* ── flatten nested sections ── */
    const nestedToFlat = (nestedData: any) => {
        const elements = [...(nestedData.elements || [])];
        const sections: any[] = [];

        (nestedData.sections || []).forEach((section: any) => {
            const {
                'sub-sections': subsections,
                elements: sectionElements,
                backgroundColor: _bg,
                borderColor: _bc,
                direction: _dir,
                ...sectionData
            } = section;
            sections.push(sectionData);

            (sectionElements || []).forEach((el: any) => {
                elements.push({ ...el, x: el.x + section.x, y: el.y + section.y, parentSection: section.id });
            });

            (subsections || []).forEach((sub: any) => {
                const { elements: subEls, backgroundColor: _b, borderColor: _c, direction: _d, ...subData } = sub;
                sections.push({
                    ...subData,
                    type: 'subsection',
                    x: subData.x + section.x,
                    y: subData.y + section.y,
                    parentSection: section.id,
                });
                (subEls || []).forEach((el: any) => {
                    elements.push({
                        ...el,
                        x: el.x + subData.x + section.x,
                        y: el.y + subData.y + section.y,
                        parentSection: sub.id,
                    });
                });
            });
        });

        return { elements, sections };
    };

    const { elements, sections } = nestedToFlat(data || {});
    const { canvasSettings = {} } = data || {};

    const A4_W = 210, A4_H = 297;
    const PREVIEW_W = 230;
    const PREVIEW_H = PREVIEW_W * (A4_H / A4_W);

    const canvasW = canvasSettings?.width
        ? parseFloat(canvasSettings.width) * 96 / 25.4
        : A4_W * 96 / 25.4;

    const scale = PREVIEW_W / canvasW;

    /* ── element renderers ── */
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
        return el.content;
    };

    const elStyle = (el: any, ox = 0, oy = 0): React.CSSProperties => ({
        position: 'absolute',
        left:   `${(el.x - ox) * scale}px`,
        top:    `${(el.y - oy) * scale}px`,
        width:  `${el.width  * scale}px`,
        height: `${el.height * scale}px`,
        ...(el.type === 'line-break'
            ? { display: 'flex', alignItems: 'center', justifyContent: 'center' }
            : {
                fontSize:   `${(el.fontSize  || 16) * scale}px`,
                fontWeight: el.fontWeight || 'normal',
                fontFamily: el.fontFamily || 'Arial',
                color:      el.color      || '#000',
                textAlign:  el.textAlign  || 'left',
                lineHeight: el.lineHeight || 1.5,
                overflow:   'hidden',
                whiteSpace: 'pre-wrap',
                wordWrap:   'break-word',
            }),
    });

    const renderSection = (section: any) => {
        if (section.parentSection) return null;
        const subs = sections.filter(s => s.parentSection === section.id);

        return (
            <div key={section.id} style={{
                position: 'absolute',
                left:   `${section.x * scale}px`,
                top:    `${section.y * scale}px`,
                width:  `${section.width  * scale}px`,
                height: `${section.height * scale}px`,
                boxSizing: 'border-box',
                padding: `${2 * scale}px`,
            }}>
                {section.title && section.headerVisible !== false && (
                    <div style={{
                        fontSize:   `${(section.headerFontSize   || 18) * scale}px`,
                        fontWeight: section.headerFontWeight || '700',
                        fontFamily: section.headerFontFamily || 'Arial',
                        color:      section.headerColor      || '#1f2937',
                        textAlign:  section.headerTextAlign  || 'left',
                        lineHeight: section.headerLineHeight || 1.2,
                        marginBottom: `${1 * scale}px`,
                        padding: `${2 * scale}px`,
                    }}>
                        {section.title}
                    </div>
                )}

                {subs.map(sub => (
                    <div key={sub.id} style={{
                        position: 'absolute',
                        left:   `${(sub.x - section.x) * scale}px`,
                        top:    `${(sub.y - section.y) * scale}px`,
                        width:  `${sub.width  * scale}px`,
                        height: `${sub.height * scale}px`,
                        boxSizing: 'border-box',
                    }}>
                        {elements
                            .filter(el => el.parentSection === sub.id)
                            .map(el => (
                                <div key={el.id} style={elStyle(el, sub.x, sub.y)}>
                                    {renderContent(el)}
                                </div>
                            ))}
                    </div>
                ))}

                {elements
                    .filter(el => el.parentSection === section.id && !subs.some(s => el.parentSection === s.id))
                    .map(el => (
                        <div key={el.id} style={elStyle(el, section.x, section.y)}>
                            {renderContent(el)}
                        </div>
                    ))}
            </div>
        );
    };

    const hasContent = sections.length > 0 || elements.length > 0;

    return (
        <div className="group flex flex-col">

            {/* ── Thumbnail ── */}
            <div
                className="relative w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:ring-dark-700 group-hover:ring-2 group-hover:ring-indigo-400 group-hover:shadow-lg group-hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer"
                style={{ aspectRatio: '210 / 297' }}
                onClick={() => navigate(`/edit/${resumeId}`)}
            >
                {/* Resume content preview */}
                {hasContent ? (
                    <div style={{ width: PREVIEW_W, height: PREVIEW_H, position: 'relative', pointerEvents: 'none' }}>
                        {sections.map(s => renderSection(s))}
                        {elements.filter(el => !el.parentSection).map(el => (
                            <div key={el.id} style={elStyle(el)}>{renderContent(el)}</div>
                        ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-dark-800">
                        <FileText className="size-10 text-gray-200 dark:text-dark-600" strokeWidth={1} />
                        <span className="text-[11px] text-gray-300 dark:text-dark-600 font-medium">Empty resume</span>
                    </div>
                )}

                {/* Hover overlay — Edit + Preview labels */}
                <div className="absolute inset-0 bg-gray-950/0 group-hover:bg-gray-950/55 flex flex-col items-center justify-center gap-2 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                    {/* Edit pill */}
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/edit/${resumeId}`); }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-semibold rounded-xl shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                    >
                        <Pencil className="size-3.5" />
                        Edit
                    </button>

                    {/* Preview pill */}
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/resumes/${resumeId}/preview`); }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-[12px] font-medium rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 delay-[25ms]"
                    >
                        <Eye className="size-3" />
                        Preview
                    </button>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="mt-2.5 px-0.5 flex items-center justify-between gap-2">
                {/* Name + timestamp */}
                <div className="min-w-0 flex-1">
                    <h3 className="text-[13px] font-semibold text-gray-800 dark:text-dark-200 truncate leading-snug">
                        {resume.name || 'Untitled Resume'}
                    </h3>
                    <p className="text-[11px] text-gray-400 dark:text-dark-500 mt-0.5">
                        Edited {timeAgo(resume.updatedAt)}
                    </p>
                </div>

                {/* Always-visible action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => navigate(`/resumes/${resumeId}/preview`)}
                        title="Preview"
                        className="size-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-dark-500 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-700 dark:hover:text-dark-200 transition-colors"
                    >
                        <Eye className="size-3.5" />
                    </button>

                    <button
                        onClick={() => navigate(`/edit/${resumeId}`)}
                        title="Edit"
                        className="size-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-dark-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <Pencil className="size-3.5" />
                    </button>

                    {onDelete && (
                        <button
                            onClick={() => {
                                if (window.confirm(`Delete "${resume.name || 'this resume'}"?`)) {
                                    onDelete(resumeId);
                                }
                            }}
                            title="Delete"
                            className="size-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-dark-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="size-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeCard;
