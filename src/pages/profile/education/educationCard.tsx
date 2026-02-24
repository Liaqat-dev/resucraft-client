import React from "react";
import {Education} from "@dtos/userProfile.ts";
import {Edit2, Trash2} from "lucide-react";

interface Props {
    edu: Education;
    onDelete: () => void;
    onEdit: (edu: Education) => void;
}

const fmt = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
        month: "short",
        year: "numeric",
    });
};

const EducationCard: React.FC<Props> = ({edu, onDelete, onEdit}) => {
    const dateRange = `${fmt(edu.startDate)} – ${edu.endDate ? fmt(edu.endDate) : "Present"}`;

    return (
        <div className="relative pl-4 before:absolute before:left-0 before:inset-y-0 before:w-0.5 before:rounded-full before:bg-emerald-400 dark:before:bg-emerald-500">
            {/* Top row: degree + date */}
            <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-gray-800 dark:text-dark-100 leading-snug">
                    {edu.degree}
                </p>
                <span className="text-xs text-gray-400 dark:text-dark-500 whitespace-nowrap shrink-0">
                    {dateRange}
                </span>
            </div>

            {/* School · Field of Study */}
            <p className="mt-0.5 text-xs text-gray-500 dark:text-dark-400">
                {edu.school}
                {edu.fieldOfStudy && (
                    <span className="before:content-['·'] before:mx-1.5 before:text-gray-300 dark:before:text-dark-600">
                        {edu.fieldOfStudy}
                    </span>
                )}
            </p>

            {/* Description + actions */}
            {edu.description ? (
                <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-dark-800 flex items-end justify-between gap-4">
                    <p className="text-xs text-gray-500 dark:text-dark-400 leading-relaxed line-clamp-2 flex-1">
                        {edu.description}
                    </p>
                    <Actions onEdit={() => onEdit(edu)} onDelete={onDelete}/>
                </div>
            ) : (
                <div className="mt-2 flex justify-end">
                    <Actions onEdit={() => onEdit(edu)} onDelete={onDelete}/>
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

export default EducationCard;