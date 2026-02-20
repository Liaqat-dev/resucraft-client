import React from "react";
import { Experience } from "@dtos/experience";
import { Edit2, Trash2 } from "lucide-react";

interface Props {
    exp: Experience;
    onDelete: () => void;
    onEdit: (exp: Experience) => void;
}

const formatMonthYear = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
        month: "short",
        year: "numeric"
    });
};

const ExperienceCard: React.FC<Props> = ({ exp, onDelete, onEdit }) => {
    return (
        <div className="border p-4 rounded-lg shadow-sm dark:border-dark-700">
            <div className="flex justify-between">
                <div>
                    <h5 className="font-semibold">{exp.role}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.company}
                    </p>
                    <p className="text-sm text-gray-500">
                        {formatMonthYear(exp.startDate)} -{" "}
                        {exp.currentlyWorking
                            ? "Present"
                            : formatMonthYear(exp.endDate || "")}
                    </p>
                    {exp.description && (
                        <p className="text-gray-500 dark:text-gray-300 mt-1">
                            {exp.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onEdit(exp)}
                        className="p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-500 transition"
                    >
                        <Edit2 size={28} />
                    </button>

                    <button
                        onClick={onDelete}
                        className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900 text-red-500 transition"
                    >
                        <Trash2 size={28} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExperienceCard;