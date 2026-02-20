import React from "react";
import { Education } from "@dtos/education";
import { Edit2, Trash2 } from "lucide-react";

interface Props {
    edu: Education;
    onDelete: () => void;
    onEdit: (edu: Education) => void;
}


const formatMonthYear = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
        month: "short",
        year: "numeric"
    });
};

const EducationCard: React.FC<Props> = ({ edu, onDelete, onEdit }) => {
    return (
        <div className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between">
                <div>
                    <h5 className="font-semibold">{edu.degree}</h5>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">
                        {formatMonthYear(edu.startDate)} -{" "}
                        {edu.endDate ? formatMonthYear(edu.endDate) : "Present"}
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={() => onEdit(edu)} className="text-blue-500 hover:bg-blue-50">
                        <Edit2 size={28} />
                    </button>
                    <button onClick={onDelete} className="text-red-500 hover:bg-red-50">
                        <Trash2 size={28} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EducationCard;
