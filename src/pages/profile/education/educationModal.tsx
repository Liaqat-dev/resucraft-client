import React, { useState, useEffect } from "react";
import { educationService, Education, CreateEducationData } from "../../../services/education.service.ts";

interface Props {
    onClose: () => void;
    onSaved: () => void;
    educationToEdit?: Education;
}

const EducationModal: React.FC<Props> = ({ onClose, onSaved, educationToEdit }) => {
    const [form, setForm] = useState<CreateEducationData>({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    useEffect(() => {
        if (educationToEdit) {
            setForm({
                school: educationToEdit.school || "",
                degree: educationToEdit.degree || "",
                fieldOfStudy: educationToEdit.fieldOfStudy || "",
                startDate: educationToEdit.startDate ? educationToEdit.startDate.slice(0, 7) : "",
                endDate: educationToEdit.endDate ? educationToEdit.endDate.slice(0, 7) : "",
                description: educationToEdit.description || "",
            });
        }
    }, [educationToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.school || !form.degree || !form.startDate) {
            alert("School, Degree, and Start Date are required!");
            return;
        }

        try {
            if (educationToEdit) {
                await educationService.update(educationToEdit._id, form);
            } else {
                await educationService.create(form);
            }

            onSaved();
            onClose();
        } catch (err) {
            console.error("Failed to save education:", err);
            alert("Failed to save education. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-2xl w-96 flex flex-col gap-4"
            >
                <h4 className="font-bold text-xl text-gray-800 text-center mt-12 mb-2">
                    {educationToEdit ? "Edit" : "Add"} Education
                </h4>

                <input
                    type="text"
                    name="school"
                    placeholder="Institution"
                    value={form.school}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md"
                />

                <input
                    type="text"
                    name="degree"
                    placeholder="Degree"
                    value={form.degree}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md"
                />

                <input
                    type="text"
                    name="fieldOfStudy"
                    placeholder="Field of Study"
                    value={form.fieldOfStudy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md"
                />


                    <div className="relative flex-1">
                        <input
                            type="month"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            required
                            placeholder=" "
                            className="peer w-full px-4 pt-5 pb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md"
                        />
                        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
                            Start Date
                        </label>
                    </div>

                    <div className="relative flex-1">
                        <input
                            type="month"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            placeholder=" "
                            className="peer w-full px-4 pt-5 pb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md"
                        />
                        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
                            End Date
                        </label>
                    </div>


                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 shadow-sm hover:shadow-md resize-none"
                />

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-200"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200 shadow-md hover:shadow-lg"
                    >
                        {educationToEdit ? "Update" : "Add"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EducationModal;
