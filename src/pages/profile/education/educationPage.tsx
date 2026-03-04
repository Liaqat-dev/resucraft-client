import React, {useEffect, useState} from "react";
import {Education} from "@dtos/index.ts";
import {useProfile} from "@hooks/useProfile.ts";
import EducationCard from "./educationCard.tsx";
import EducationModal from "./educationModal";
import DeleteConfirmModal from "@src/components/common/deleteConfirmModal";
import {GraduationCap, Plus} from "lucide-react";

// ── Skeleton ──────────────────────────────────────────────────────────────────

const Skeleton: React.FC = () => (
    <div className="space-y-3">
        {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 rounded-lg border border-gray-100 dark:border-dark-800 animate-pulse">
                <div className="size-10 rounded-md bg-gray-100 dark:bg-dark-800 shrink-0"/>
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-44 bg-gray-200 dark:bg-dark-700 rounded"/>
                    <div className="h-3 w-32 bg-gray-100 dark:bg-dark-800 rounded"/>
                    <div className="h-3 w-28 bg-gray-100 dark:bg-dark-800 rounded"/>
                </div>
            </div>
        ))}
    </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState: React.FC<{onAdd: () => void}> = ({onAdd}) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-3">
            <GraduationCap size={20} className="text-emerald-400 dark:text-emerald-500"/>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-dark-300 mb-1">No education yet</p>
        <p className="text-xs text-gray-400 dark:text-dark-500 mb-4">Add your academic background to complete your profile.</p>
        <button onClick={onAdd} className="btn btn-primary flex items-center gap-1.5">
            <Plus size={14}/>
            Add Education
        </button>
    </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const EducationPage: React.FC = () => {
    const { education, educationLoading, fetchEducation, deleteEducation } = useProfile();
    const [open, setOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchEducation(); // no-op if already loaded
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteId(null);
        await deleteEducation(deleteId);
    };

    const handleAdd = () => {
        setEditingEducation(null);
        setOpen(true);
    };

    return (
        <div className="card">
            <div className="card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-md bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                        <GraduationCap size={15} className="text-emerald-600 dark:text-emerald-400"/>
                    </div>
                    <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                        Education
                        {!educationLoading && education.length > 0 && (
                            <span className="ml-2 text-xs font-normal text-gray-400 dark:text-dark-500">
                                ({education.length})
                            </span>
                        )}
                    </h2>
                </div>
                {!educationLoading && education.length > 0 && (
                    <button onClick={handleAdd} className="btn btn-primary flex items-center gap-1.5">
                        <Plus size={14}/>
                        Add
                    </button>
                )}
            </div>

            <div className="card-body">
                {educationLoading ? (
                    <Skeleton/>
                ) : education.length === 0 ? (
                    <EmptyState onAdd={handleAdd}/>
                ) : (
                    <div className="space-y-px">
                        {education.map((edu) => (
                            <div key={edu._id} className="px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                                <EducationCard
                                    edu={edu}
                                    onDelete={() => setDeleteId(edu._id)}
                                    onEdit={(e) => {
                                        setEditingEducation(e);
                                        setOpen(true);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {open && (
                <EducationModal
                    onClose={() => {
                        setEditingEducation(null);
                        setOpen(false);
                    }}
                    onSaved={() => fetchEducation(true)}
                    educationToEdit={editingEducation ?? undefined}
                />
            )}

            {deleteId && (
                <DeleteConfirmModal
                    message="Are you sure you want to delete this education?"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
};

export default EducationPage;