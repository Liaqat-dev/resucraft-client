import React, {useEffect, useState} from "react";
import {useProfile} from "@hooks/useProfile.ts";
import {Loader2, Plus, Tag, X} from "lucide-react";
import DeleteConfirmModal from "@src/components/common/deleteConfirmModal";
import toast from "react-hot-toast";

const categories = ["Technical", "Soft", "Other"];

// ── Shared input styles (mirrors personalInfoPage Field) ──────────────────────
const inputCls =
    "w-full pl-9 pr-4 py-2.5 text-sm rounded-md border " +
    "bg-white dark:bg-dark-900 dark:text-dark-100 " +
    "transition-colors duration-150 focus:outline-none focus:ring-2 " +
    "border-gray-200 dark:border-dark-800 hover:border-gray-300 dark:hover:border-dark-700 " +
    "focus:ring-primary-500/20 focus:border-primary-500";

const labelCls = "block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400";

// ── Per-category accent colours ───────────────────────────────────────────────
const categoryMeta: Record<string, {
    border: string;
    dot: string;
    chip: string;
}> = {
    Technical: {
        border: "before:bg-primary-400 dark:before:bg-primary-500",
        dot:    "bg-primary-500",
        chip:   "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 border-primary-100 dark:border-primary-500/20",
    },
    Soft: {
        border: "before:bg-emerald-400 dark:before:bg-emerald-500",
        dot:    "bg-emerald-500",
        chip:   "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/20",
    },
    Other: {
        border: "before:bg-amber-400 dark:before:bg-amber-500",
        dot:    "bg-amber-500",
        chip:   "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-500/20",
    },
};

// ── Page ──────────────────────────────────────────────────────────────────────

const SkillsPage: React.FC = () => {
    const { skills, fetchSkills, createSkills, deleteSkill } = useProfile();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [newSkills, setNewSkills] = useState<Record<string, string[]>>({
        Technical: [],
        Soft: [],
        Other: [],
    });

    useEffect(() => {
        fetchSkills(); // no-op if already loaded
    }, []);

    const addField = (category: string) => {
        setNewSkills((prev) => ({...prev, [category]: [...prev[category], ""]}));
    };

    const handleChange = (category: string, index: number, value: string) => {
        const updated = [...newSkills[category]];
        updated[index] = value;
        setNewSkills((prev) => ({...prev, [category]: updated}));
    };

    const removeField = (category: string, index: number) => {
        setNewSkills((prev) => {
            const updated = [...prev[category]];
            updated.splice(index, 1);
            return {...prev, [category]: updated};
        });
    };

    const saveSkills = async (category: string) => {
        const skillsToSave = newSkills[category]
            .filter((s) => s.trim() !== "")
            .map((name) => ({name, category}));
        if (skillsToSave.length === 0) return;
        setSaving((prev) => ({...prev, [category]: true}));
        try {
            await (createSkills(skillsToSave) as any);
            setNewSkills((prev) => ({...prev, [category]: []}));
        } catch {
            toast.error(`Failed to save ${category} skills`);
        } finally {
            setSaving((prev) => ({...prev, [category]: false}));
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteId(null);
        await deleteSkill(deleteId);
    };

    return (
        <div className="card">
            <div className="card-header flex items-center gap-3">
                <div className="size-8 rounded-md bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                    <Tag size={15} className="text-primary-600 dark:text-primary-400"/>
                </div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">Skills</h2>
            </div>

            <div className="card-body space-y-px">
                {categories.map((category) => {
                    const categorySkills = skills.filter((s) => s.category === category);
                    const meta = categoryMeta[category];
                    const isSaving = saving[category] ?? false;
                    const hasNew = newSkills[category].length > 0;

                    return (
                        <div
                            key={category}
                            className={`relative pl-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors before:absolute before:left-0 before:inset-y-3 before:w-0.5 before:rounded-full ${meta.border}`}
                        >
                            {/* Top row: category title + count | add button */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`size-1.5 rounded-full shrink-0 ${meta.dot}`}/>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-dark-100">
                                        {category} Skills
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-dark-500">
                                        ({categorySkills.length})
                                    </span>
                                </div>
                                <button
                                    onClick={() => addField(category)}
                                    className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                >
                                    <Plus size={12}/>
                                    Add
                                </button>
                            </div>

                            {/* Existing skill chips */}
                            {categorySkills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                    {categorySkills.map((skill) => (
                                        <span
                                            key={skill._id}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${meta.chip}`}
                                        >
                                            {skill.name}
                                            <button
                                                onClick={() => setDeleteId(skill._id)}
                                                className="hover:opacity-60 transition-opacity"
                                            >
                                                <X size={10}/>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Empty hint */}
                            {categorySkills.length === 0 && !hasNew && (
                                <p className="mt-1.5 text-xs text-gray-400 dark:text-dark-500">
                                    No {category.toLowerCase()} skills yet.
                                </p>
                            )}

                            {/* New skill inputs */}
                            {hasNew && (
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-800 space-y-2">
                                    <label className={labelCls}>New {category} Skills</label>
                                    {newSkills[category].map((value, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-dark-500">
                                                    <Tag size={13}/>
                                                </span>
                                                <input
                                                    value={value}
                                                    onChange={(e) => handleChange(category, index, e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            addField(category);
                                                        }
                                                    }}
                                                    placeholder={`Enter ${category.toLowerCase()} skill`}
                                                    className={inputCls}
                                                    disabled={isSaving}
                                                    autoFocus={index === newSkills[category].length - 1}
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeField(category, index)}
                                                disabled={isSaving}
                                                className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <X size={13}/>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Save row */}
                                    <div className="flex justify-end pt-1">
                                        <button
                                            onClick={() => saveSkills(category)}
                                            disabled={isSaving}
                                            className="btn btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isSaving
                                                ? <><Loader2 size={14} className="animate-spin"/>Saving...</>
                                                : `Save ${category} Skills`
                                            }
                                        </button>
                                    </div>
                                </div>
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