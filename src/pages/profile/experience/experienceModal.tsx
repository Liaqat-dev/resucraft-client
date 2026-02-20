import React, { useState, useEffect } from "react";
import { Experience, CreateExperienceData } from "@dtos/experience";
import { experienceService } from "../../../services/experience.service.ts";

interface Props {
    userId: string;
    onClose: () => void;
    onSaved: () => void;
    experienceToEdit?: Experience;
}

const ExperienceModal: React.FC<Props> = ({ userId, onClose, onSaved, experienceToEdit }) => {
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentlyWorking, setCurrentlyWorking] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (experienceToEdit) {
            setCompany(experienceToEdit.company);
            setRole(experienceToEdit.role);
            setDescription(experienceToEdit.description || "");
            setStartDate(experienceToEdit.startDate.substring(0, 7));
            setEndDate(experienceToEdit.endDate ? experienceToEdit.endDate.substring(0, 7) : "");
            setCurrentlyWorking(experienceToEdit.currentlyWorking);
        }
    }, [experienceToEdit]);

    const handleSave = async () => {
        if (!company || !role || !startDate) {
            alert("Please fill required fields");
            return;
        }

        setLoading(true);

        const payload: CreateExperienceData = {
            userId,
            company,
            role,
            description,
            startDate,
            endDate: currentlyWorking ? undefined : endDate,
            currentlyWorking,
        };

        try {
            if (experienceToEdit) {
                await experienceService.updateExperience(experienceToEdit._id, payload);
            } else {
                await experienceService.createExperience(payload);
            }
            onSaved();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-700 rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] flex flex-col">
                <h4 className="font-bold text-xl text-gray-800 dark:text-gray-100 text-center mt-12 mb-4">
                    {experienceToEdit ? "Edit Experience" : "Add Experience"}
                </h4>


                <div className="flex-1 overflow-y-auto px-6 space-y-5 scrollbar-hide">

                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company Name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md"
                    />


                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Role"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md"
                    />

                    <div className="relative w-full">
                        <input
                            type="month"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder=" "
                            className="peer w-full px-4 pt-5 pb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md"
                        />
                        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
                            Start Date
                        </label>
                    </div>


                    {!currentlyWorking && (
                        <div className="relative w-full">
                            <input
                                type="month"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md"
                            />
                            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
                                End Date
                            </label>
                        </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            checked={currentlyWorking}
                            onChange={(e) => setCurrentlyWorking(e.target.checked)}
                            className="checkbox checkbox-primary"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Currently Working Here</span>
                    </div>


                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Description"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md resize-none"
                    />

                </div>


                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                    <button onClick={onClose} className="btn btn-outline">
                        Cancel
                    </button>
                    <button onClick={handleSave} className={`btn btn-primary ${loading ? "loading" : ""}`}>
                        {experienceToEdit ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExperienceModal;
