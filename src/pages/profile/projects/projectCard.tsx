import React from "react";
import { Project } from "@dtos/userProfile.ts";
import { Edit2, ExternalLink, Github, Trash2 } from "lucide-react";

interface Props {
    project: Project;
    onDelete: () => void;
    onEdit: (project: Project) => void;
}

const statusMeta: Record<Project["status"], { label: string; cls: string }> = {
    completed:   { label: "Completed",   cls: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" },
    "in-progress": { label: "In Progress", cls: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20" },
    planned:     { label: "Planned",     cls: "bg-gray-50 dark:bg-dark-800 text-gray-500 dark:text-dark-400 border-gray-200 dark:border-dark-700" },
};

const fmt = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
        month: "short",
        year: "numeric",
    });
};

const ProjectCard: React.FC<Props> = ({ project, onDelete, onEdit }) => {
    const meta = statusMeta[project.status] ?? statusMeta.completed;

    const dateRange =
        project.startDate
            ? `${fmt(project.startDate)} – ${project.endDate ? fmt(project.endDate) : "Present"}`
            : null;

    return (
        <div className="relative pl-4 before:absolute before:left-0 before:inset-y-0 before:w-0.5 before:rounded-full before:bg-violet-400 dark:before:bg-violet-500">
            {/* Top row: title + date */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-dark-100 leading-snug">
                        {project.title}
                    </p>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${meta.cls}`}>
                        {meta.label}
                    </span>
                </div>
                {dateRange && (
                    <span className="text-xs text-gray-400 dark:text-dark-500 whitespace-nowrap shrink-0">
                        {dateRange}
                    </span>
                )}
            </div>

            {/* Technologies */}
            {project.technologies.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                        <span
                            key={tech}
                            className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-500/20"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            )}

            {/* Description + links + actions */}
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-dark-800 flex items-end justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {project.description && (
                        <p className="text-xs text-gray-500 dark:text-dark-400 leading-relaxed line-clamp-2 mb-1.5">
                            {project.description}
                        </p>
                    )}
                    <div className="flex items-center gap-3">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                <ExternalLink size={11} />
                                Live
                            </a>
                        )}
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200"
                            >
                                <Github size={11} />
                                Repo
                            </a>
                        )}
                    </div>
                </div>
                <Actions onEdit={() => onEdit(project)} onDelete={onDelete} />
            </div>
        </div>
    );
};

const Actions: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => (
    <div className="flex items-center gap-0.5 shrink-0">
        <button
            onClick={onEdit}
            className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-500/10 transition-colors"
            title="Edit"
        >
            <Edit2 size={13} />
        </button>
        <button
            onClick={onDelete}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Delete"
        >
            <Trash2 size={13} />
        </button>
    </div>
);

export default ProjectCard;