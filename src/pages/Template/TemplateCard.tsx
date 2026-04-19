import { Pencil, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TemplateRenderer } from '@src/components/Previewer';
import {timeAgoTemplates as timeAgo} from "@src/utils/url_helper.ts";

const CATEGORY_COLOR: Record<string, string> = {
    Modern:       'bg-blue-500',
    Classic:      'bg-slate-400',
    Creative:     'bg-violet-500',
    Minimal:      'bg-teal-500',
    Professional: 'bg-emerald-500',
    Other:        'bg-orange-400',
};


interface TemplateCardProps {
    template: any;
    onDelete?: (id: string) => void;
    isOwn?: boolean;
}

const TemplateCard = ({ template, onDelete, isOwn = true }: TemplateCardProps) => {
    const navigate = useNavigate();
    const { data } = template;
    const { canvasSettings = {} } = data || {};

    const A4_W = 210, A4_H = 297;
    const PREVIEW_W = 230;
    const PREVIEW_H = PREVIEW_W * (A4_H / A4_W);

    const canvasW = canvasSettings?.width
        ? parseFloat(canvasSettings.width) * 96 / 25.4
        : A4_W * 96 / 25.4;

    const scale = PREVIEW_W / canvasW;
    const catColor = CATEGORY_COLOR[template.category] || CATEGORY_COLOR['Other'];

    return (
        // Named group — hover is scoped to this card only
        <div className="group/card cursor-pointer">

            {/* ── Thumbnail ── */}
            <div
                className="relative w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:ring-dark-700 group-hover/card:ring-2 group-hover/card:ring-primary-400 group-hover/card:shadow-lg group-hover/card:shadow-primary-500/10 transition-all duration-200"
                style={{ aspectRatio: '210 / 297' }}
                onClick={() => navigate(`/templates/${template._id}/preview`)}
            >
                <div style={{ width: PREVIEW_W, height: PREVIEW_H, position: 'relative' }}>
                    <TemplateRenderer data={data} scale={scale} />
                </div>

                {/* Action bar — slides up from bottom on hover */}
                <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-1.5 px-2 py-2 opacity-0 translate-y-1 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-200 pointer-events-none group-hover/card:pointer-events-auto bg-gradient-to-t from-white/90 via-white/60 to-transparent">
                    {isOwn && (
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/builder/${template._id}`); }}
                            title="Edit"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 text-gray-700 text-[12px] font-semibold rounded-lg shadow-sm transition-colors"
                        >
                            <Pencil className="size-3" />
                            Edit
                        </button>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/templates/${template._id}/preview`); }}
                        title="View"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[12px] font-semibold rounded-lg shadow-sm transition-colors"
                    >
                        <Eye className="size-3" />
                        View
                    </button>

                    {isOwn && onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete "${template.name}"?`)) onDelete(template._id);
                            }}
                            title="Delete"
                            className="inline-flex items-center justify-center size-[30px] bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-gray-400 rounded-lg shadow-sm transition-colors"
                        >
                            <Trash2 className="size-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="mt-2.5 px-0.5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-gray-800 dark:text-dark-200 truncate leading-snug">
                        {template.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 dark:text-dark-500 mt-0.5">
                        {isOwn ? `Edited ${timeAgo(template.updatedAt)}` : template.category || 'Template'}
                    </p>
                </div>
                {template.category && template.category !== 'Other' && (
                    <span className={`mt-1 shrink-0 size-2 rounded-full ${catColor}`} title={template.category} />
                )}
            </div>
        </div>
    );
};

export default TemplateCard;
