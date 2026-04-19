import { Pencil, Trash2, Eye, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateRenderer } from '@src/components/Previewer';
import {timeAgoTemplates as timeAgo} from "@src/utils/url_helper.ts";


interface ResumeCardProps {
    resume: any;
    onDelete?: (id: string) => void;
}

const ResumeCard = ({ resume, onDelete }: ResumeCardProps) => {
    const navigate = useNavigate();
    const resumeId = resume._id ?? resume.id;
    const { data } = resume;

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerW, setContainerW] = useState(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const A4_W = 210, A4_H = 297;
    const previewW = containerW || 0;

    const canvasW = data?.canvasSettings?.width
        ? parseFloat(data.canvasSettings.width) * 96 / 25.4
        : A4_W * 96 / 25.4;

    const scale = previewW / canvasW;

    const hasContent = (data?.sections?.length ?? 0) > 0 || (data?.elements?.length ?? 0) > 0;

    return (
        <div className="group/card cursor-pointer">

            {/* ── Thumbnail ── */}
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:ring-dark-700 group-hover/card:ring-2 group-hover/card:ring-primary-400 group-hover/card:shadow-lg group-hover/card:shadow-primary-500/10 transition-all duration-200"
                style={{ aspectRatio: '210 / 297' }}
                onClick={() => navigate(`/preview/${resumeId}`)}
            >
                {/* Resume content preview */}
                {hasContent ? (
                    <div style={{ width: previewW, height: previewW * (A4_H / A4_W), position: 'relative', pointerEvents: 'none' }}>
                        <TemplateRenderer data={data} scale={scale} />
                    </div>
                ) : (
                    /* Empty state */
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-dark-800">
                        <FileText className="size-10 text-gray-200 dark:text-dark-600" strokeWidth={1} />
                        <span className="text-[11px] text-gray-300 dark:text-dark-600 font-medium">Empty resume</span>
                    </div>
                )}
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
                        onClick={() => navigate(`/preview/${resumeId}`)}
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
