import React, { useEffect, useState } from "react";
import { Project } from "@dtos/userProfile.ts";
import { useProfile } from "@src/hooks/useProfile.ts";
import ProjectCard from "./projectCard.tsx";
import ProjectModal from "./projectModal.tsx";
import DeleteConfirmModal from "@src/components/common/deleteConfirmModal";
import { FolderOpen, Plus } from "lucide-react";
import toast from "react-hot-toast";

// ── Skeleton ───────────────────────────────────────────────────────────────────

const Skeleton: React.FC = () => (
    <div className="space-y-3">
        {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 rounded-lg border border-gray-100 dark:border-dark-800 animate-pulse">
                <div className="size-10 rounded-md bg-gray-100 dark:bg-dark-800 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-44 bg-gray-200 dark:bg-dark-700 rounded" />
                    <div className="h-3 w-32 bg-gray-100 dark:bg-dark-800 rounded" />
                    <div className="h-3 w-52 bg-gray-100 dark:bg-dark-800 rounded" />
                </div>
            </div>
        ))}
    </div>
);

// ── Empty state ────────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="size-12 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mb-3">
            <FolderOpen size={20} className="text-violet-400 dark:text-violet-500" />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-dark-300 mb-1">No projects yet</p>
        <p className="text-xs text-gray-400 dark:text-dark-500 mb-4">Showcase your work by adding your projects.</p>
        <button onClick={onAdd} className="btn btn-primary flex items-center gap-1.5">
            <Plus size={14} />
            Add Project
        </button>
    </div>
);

// ── Page ───────────────────────────────────────────────────────────────────────

const ProjectsPage: React.FC = () => {
    const { projects, projectsLoading, fetchProjects, deleteProject } = useProfile();
    const [open, setOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleAdd = () => {
        setEditingProject(undefined);
        setOpen(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await deleteProject(deleteId).unwrap();
            toast.success("Project deleted");
        } catch {
            toast.error("Failed to delete project");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="card">
            <div className="card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-md bg-violet-50 dark:bg-violet-950 flex items-center justify-center shrink-0">
                        <FolderOpen size={15} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                        Projects
                        {!projectsLoading && projects.length > 0 && (
                            <span className="ml-2 text-xs font-normal text-gray-400 dark:text-dark-500">
                                ({projects.length})
                            </span>
                        )}
                    </h2>
                </div>
                {!projectsLoading && projects.length > 0 && (
                    <button onClick={handleAdd} className="btn btn-primary flex items-center gap-1.5">
                        <Plus size={14} />
                        Add
                    </button>
                )}
            </div>

            <div className="card-body">
                {projectsLoading ? (
                    <Skeleton />
                ) : projects.length === 0 ? (
                    <EmptyState onAdd={handleAdd} />
                ) : (
                    <div className="space-y-px">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                className="px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
                            >
                                <ProjectCard
                                    project={project}
                                    onEdit={handleEdit}
                                    onDelete={() => setDeleteId(project._id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {open && (
                <ProjectModal
                    onClose={() => {
                        setEditingProject(undefined);
                        setOpen(false);
                    }}
                    projectToEdit={editingProject}
                />
            )}

            {deleteId && (
                <DeleteConfirmModal
                    message="Are you sure you want to delete this project?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
};

export default ProjectsPage;