import React, { useEffect, useState, KeyboardEvent } from "react";
import { Project, CreateProjectData } from "@dtos/userProfile.ts";
import { Calendar, FileText, Github, Globe, Loader2, Plus, Tag, X } from "lucide-react";
import toast from "react-hot-toast";
import { useProfile } from "@src/hooks/useProfile.ts";

interface Props {
    onClose: () => void;
    projectToEdit?: Project;
}

const inputCls =
    "w-full pl-9 pr-4 py-2.5 text-sm rounded-md border " +
    "bg-white dark:bg-dark-900 dark:text-dark-100 " +
    "transition-colors duration-150 focus:outline-none focus:ring-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed " +
    "border-gray-200 dark:border-dark-800 hover:border-gray-300 dark:hover:border-dark-700 " +
    "focus:ring-primary-500/20 focus:border-primary-500";

const labelCls = "block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400";
const iconCls = "absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-dark-500";

const FormField: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
    <div className="space-y-1.5">
        <label className={labelCls}>{label}</label>
        <div className="relative">
            <span className={iconCls}>{icon}</span>
            {children}
        </div>
    </div>
);

const statusOptions: { value: CreateProjectData["status"]; label: string }[] = [
    { value: "completed",   label: "Completed" },
    { value: "in-progress", label: "In Progress" },
    { value: "planned",     label: "Planned" },
];

const ProjectModal: React.FC<Props> = ({ onClose, projectToEdit }) => {
    const { createProject, editProject } = useProfile();

    const [form, setForm] = useState<CreateProjectData>({
        title: "",
        description: "",
        liveUrl: "",
        repoUrl: "",
        startDate: "",
        endDate: "",
        technologies: [],
        status: "completed",
    });
    const [techInput, setTechInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (projectToEdit) {
            setForm({
                title: projectToEdit.title,
                description: projectToEdit.description || "",
                liveUrl: projectToEdit.liveUrl || "",
                repoUrl: projectToEdit.repoUrl || "",
                startDate: projectToEdit.startDate || "",
                endDate: projectToEdit.endDate || "",
                technologies: projectToEdit.technologies || [],
                status: projectToEdit.status || "completed",
            });
        }
    }, [projectToEdit]);

    const set = (field: keyof CreateProjectData, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const addTech = () => {
        const t = techInput.trim();
        if (!t || form.technologies!.includes(t)) return;
        setForm((prev) => ({ ...prev, technologies: [...(prev.technologies || []), t] }));
        setTechInput("");
    };

    const removeTech = (tech: string) =>
        setForm((prev) => ({ ...prev, technologies: (prev.technologies || []).filter((t) => t !== tech) }));

    const handleTechKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTech();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) {
            toast.error("Project title is required");
            return;
        }
        setLoading(true);
        try {
            if (projectToEdit) {
                await editProject(projectToEdit._id, form).unwrap();
            } else {
                await createProject(form).unwrap();
            }
            onClose();
        } catch (err: any) {
            toast.error(err?.message || "Failed to save project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-dark-700 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-600 shrink-0">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                        {projectToEdit ? "Edit Project" : "Add Project"}
                    </h4>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-dark-500 dark:hover:text-dark-200 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {/* Title */}
                    <FormField label="Project Title" icon={<Tag size={14} />}>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            placeholder="e.g. E-commerce Platform"
                            className={inputCls}
                            disabled={loading}
                            autoFocus
                        />
                    </FormField>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label className={labelCls}>Status</label>
                        <div className="flex gap-2 flex-wrap">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => set("status", opt.value!)}
                                    disabled={loading}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                                        form.status === opt.value
                                            ? "bg-primary-600 dark:bg-primary-500 text-white border-primary-600 dark:border-primary-500"
                                            : "bg-white dark:bg-dark-900 text-gray-500 dark:text-dark-400 border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Start Date" icon={<Calendar size={14} />}>
                            <input
                                type="month"
                                value={form.startDate}
                                onChange={(e) => set("startDate", e.target.value)}
                                className={inputCls}
                                disabled={loading}
                            />
                        </FormField>
                        <FormField label="End Date" icon={<Calendar size={14} />}>
                            <input
                                type="month"
                                value={form.endDate}
                                onChange={(e) => set("endDate", e.target.value)}
                                className={inputCls}
                                disabled={loading}
                            />
                        </FormField>
                    </div>

                    {/* URLs */}
                    <FormField label="Live URL" icon={<Globe size={14} />}>
                        <input
                            type="url"
                            value={form.liveUrl}
                            onChange={(e) => set("liveUrl", e.target.value)}
                            placeholder="https://my-project.com"
                            className={inputCls}
                            disabled={loading}
                        />
                    </FormField>

                    <FormField label="Repository URL" icon={<Github size={14} />}>
                        <input
                            type="url"
                            value={form.repoUrl}
                            onChange={(e) => set("repoUrl", e.target.value)}
                            placeholder="https://github.com/user/repo"
                            className={inputCls}
                            disabled={loading}
                        />
                    </FormField>

                    {/* Technologies */}
                    <div className="space-y-1.5">
                        <label className={labelCls}>Technologies</label>
                        {form.technologies!.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {form.technologies!.map((tech) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTech(tech)}
                                            className="hover:opacity-60 transition-opacity"
                                        >
                                            <X size={10} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className={iconCls}><Tag size={14} /></span>
                                <input
                                    type="text"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyDown={handleTechKeyDown}
                                    placeholder="Type and press Enter or comma"
                                    className={inputCls}
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addTech}
                                disabled={loading || !techInput.trim()}
                                className="shrink-0 px-3 rounded-md border border-gray-200 dark:border-dark-700 text-gray-500 dark:text-dark-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors disabled:opacity-40"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className={labelCls}>Description</label>
                        <div className="relative">
                            <span className="absolute top-2.5 left-3 pointer-events-none text-gray-400 dark:text-dark-500">
                                <FileText size={14} />
                            </span>
                            <textarea
                                value={form.description}
                                onChange={(e) => set("description", e.target.value)}
                                rows={3}
                                placeholder="What does this project do?"
                                className={`${inputCls} resize-none pt-2.5`}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-dark-600 shrink-0">
                    <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? <><Loader2 size={14} className="animate-spin" />Saving...</>
                            : projectToEdit ? "Update" : "Add"
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectModal;