import React, {useEffect, useState} from "react";
import {Skill, skillService} from "@src/services/skills.service.ts";
import {Plus, X} from "lucide-react";
import DeleteConfirmModal from "@src/components/common/deleteConfirmModal";

const categories = ["Technical", "Soft", "Other"];

const SkillsPage: React.FC = () => {
    const [data, setData] = useState<Skill[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [newSkills, setNewSkills] = useState<{
        [key: string]: string[];
    }>({
        Technical: [],
        Soft: [],
        Other: [],
    });

    const load = async () => {
        const res = await skillService.getAll();
        setData(res.skills || []);
    };

    useEffect(() => {
        load();
    }, []);

    const addField = (category: string) => {
        setNewSkills((prev) => ({
            ...prev,
            [category]: [...prev[category], ""],
        }));
    };

    const handleChange = (
        category: string,
        index: number,
        value: string
    ) => {
        const updated = [...newSkills[category]];
        updated[index] = value;

        setNewSkills((prev) => ({
            ...prev,
            [category]: updated,
        }));
    };

    const saveSkills = async (category: string) => {
        const skillsToSave = newSkills[category]
            .filter((s) => s.trim() !== "")
            .map((name) => ({
                name,
                category,
            }));

        if (skillsToSave.length === 0) return;

        await skillService.createBulk(skillsToSave);

        setNewSkills((prev) => ({
            ...prev,
            [category]: [],
        }));

        load();
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await skillService.delete(deleteId);
        setDeleteId(null);
        load();
    };

    return (

        <div className="card ">
            <div className={'card-header'}>
                <h2 className="text-2xl font-bold text-gray-800">
                    Skills
                </h2>
            </div>
            <div className="card-body space-y-2">

                {categories.map((category) => {
                    const skills = data.filter((s) => s.category === category);

                    return (
                        <div
                            key={category}
                            className=" shadow-lg rounded-2xl p-6 border border-gray-100 transition hover:shadow-xl"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {category} Skills
                                </h3>

                                <button
                                    onClick={() => addField(category)}
                                    className="p-2 rounded-full bg-primary-500 text-white hover:scale-110 transition"
                                >
                                    <Plus size={18}/>
                                </button>
                            </div>


                            <div className="flex flex-wrap gap-3 mb-6">
                                {skills.length === 0 && (
                                    <p className="text-sm text-gray-400">
                                        No {category.toLowerCase()} skills added yet.
                                    </p>
                                )}

                                {skills.map((skill) => (
                                    <div
                                        key={skill._id}
                                        className="px-4 py-1.5 bg-gradient-to-r from-primary-100 to-primary-50
                           text-primary-700 rounded-full flex items-center gap-2
                           shadow-sm hover:shadow-md transition"
                                    >
                                        {skill.name}

                                        <X
                                            size={18}
                                            onClick={() => setDeleteId(skill._id)}
                                            className="
    cursor-pointer
    p-1
    rounded-full
    bg-gray-200
    text-gray-800
    transition
    hover:bg-red-200
    hover:text-red-600
  "
                                        />
                                    </div>
                                ))}
                            </div>


                            <div className="space-y-3">
                                {newSkills[category].map((value, index) => (
                                    <input
                                        key={index}
                                        value={value}
                                        onChange={(e) =>
                                            handleChange(category, index, e.target.value)
                                        }
                                        placeholder="Enter skill"
                                        className="w-full px-4 py-2 border rounded-lg
                           focus:ring-2 focus:ring-primary-400
                           focus:outline-none transition"
                                    />
                                ))}
                            </div>


                            {newSkills[category].length > 0 && (
                                <button
                                    onClick={() => saveSkills(category)}
                                    className="mt-4 px-5 py-2 bg-gradient-to-r
                         from-primary-500 to-primary-600
                         text-white rounded-lg shadow-md
                         hover:shadow-lg hover:scale-[1.02] transition"
                                >
                                    Save {category} Skills
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>


            {deleteId && (
                <DeleteConfirmModal
                    message="Delete this skill?"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>

    );
};

export default SkillsPage;