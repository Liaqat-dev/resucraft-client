import React from "react";
import {Experience} from "@dtos/userProfile.ts";
import {Edit2, Trash2} from "lucide-react";

interface Props {
    exp: Experience;
    onDelete: () => void;
    onEdit: (exp: Experience) => void;
}

const fmt = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
        month: "short",
        year: "numeric",
    });
};

const ExperienceCard: React.FC<Props> = ({exp, onDelete, onEdit}) => {
    const dateRange = `${fmt(exp.startDate)} – ${exp.currentlyWorking ? "Present" : fmt(exp.endDate || "")}`;

    return (
        <div className="relative pl-4 before:absolute before:left-0 before:inset-y-0 before:w-0.5 before:rounded-full before:bg-primary-400 dark:before:bg-primary-500">
            {/* Top row: role + date */}
            <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-gray-800 dark:text-dark-100 leading-snug">
                    {exp.role}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 dark:text-dark-500 whitespace-nowrap">
                        {dateRange}
                    </span>
                    {exp.currentlyWorking && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                            <span className="size-1.5 rounded-full bg-emerald-500"/>
                            Current
                        </span>
                    )}
                </div>
            </div>

            {/* Company */}
            <p className="mt-0.5 text-xs text-gray-500 dark:text-dark-400">
                {exp.company}
            </p>

            {/* Description + actions */}
            {exp.description ? (
                <>
                    <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-dark-800 flex items-end justify-between gap-4">
                        <p className="text-xs text-gray-500 dark:text-dark-400 leading-relaxed line-clamp-2 flex-1">
                            {exp.description}
                        </p>
                        <Actions onEdit={() => onEdit(exp)} onDelete={onDelete}/>
                    </div>
                </>
            ) : (
                <div className="mt-2 flex justify-end">
                    <Actions onEdit={() => onEdit(exp)} onDelete={onDelete}/>
                </div>
            )}
        </div>
    );
};

const Actions: React.FC<{onEdit: () => void; onDelete: () => void}> = ({onEdit, onDelete}) => (
    <div className="flex items-center gap-0.5 shrink-0">
        <button
            onClick={onEdit}
            className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-500/10 transition-colors"
            title="Edit"
        >
            <Edit2 size={13}/>
        </button>
        <button
            onClick={onDelete}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Delete"
        >
            <Trash2 size={13}/>
        </button>
    </div>
);

export default ExperienceCard;