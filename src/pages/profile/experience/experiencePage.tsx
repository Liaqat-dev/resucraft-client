import React, {useEffect, useState} from "react";
import {Experience} from "@dtos/index.ts";
import {experienceService} from "@src/services/experience.service.ts";
import ExperienceModal from "./experienceModal";
import ExperienceCard from "./experienceCard";
import DeleteConfirmModal from "@src/components/common/deleteConfirmModal.tsx";
import {Briefcase, Plus} from "lucide-react";

// ── Skeleton ──────────────────────────────────────────────────────────────────

const Skeleton: React.FC = () => (
    <div className="space-y-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 rounded-lg border border-gray-100 dark:border-dark-800 animate-pulse">
                <div className="size-10 rounded-md bg-gray-100 dark:bg-dark-800 shrink-0"/>
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-40 bg-gray-200 dark:bg-dark-700 rounded"/>
                    <div className="h-3 w-28 bg-gray-100 dark:bg-dark-800 rounded"/>
                    <div className="h-3 w-36 bg-gray-100 dark:bg-dark-800 rounded"/>
                </div>
            </div>
        ))}
    </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState: React.FC<{onAdd: () => void}> = ({onAdd}) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="size-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-3">
            <Briefcase size={20} className="text-primary-400 dark:text-primary-500"/>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-dark-300 mb-1">No experience yet</p>
        <p className="text-xs text-gray-400 dark:text-dark-500 mb-4">Add your work history to strengthen your resume.</p>
        <button onClick={onAdd} className="btn btn-primary flex items-center gap-1.5">
            <Plus size={14}/>
            Add Experience
        </button>
    </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const ExperiencePage: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editExperience, setEditExperience] = useState<Experience | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const data = await experienceService.getExperiences();
            setExperiences(data.experiences);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleAdd = () => {
        setEditExperience(undefined);
        setShowModal(true);
    };

    const handleEdit = (exp: Experience) => {
        setEditExperience(exp);
        setShowModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await experienceService.deleteExperience(deleteId);
            setDeleteId(null);
            fetchExperiences();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaved = () => {
        fetchExperiences();
        setShowModal(false);
    };

    return (
        <div className="card">
            <div className="card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-md bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                        <Briefcase size={15} className="text-primary-600 dark:text-primary-400"/>
                    </div>
                    <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                        Work Experience
                        {!loading && experiences.length > 0 && (
                            <span className="ml-2 text-xs font-normal text-gray-400 dark:text-dark-500">
                                ({experiences.length})
                            </span>
                        )}
                    </h2>
                </div>
                {!loading && experiences.length > 0 && (
                    <button onClick={handleAdd} className="btn btn-primary flex items-center gap-1.5">
                        <Plus size={14}/>
                        Add
                    </button>
                )}
            </div>

            <div className="card-body">
                {loading ? (
                    <Skeleton/>
                ) : experiences.length === 0 ? (
                    <EmptyState onAdd={handleAdd}/>
                ) : (
                    <div className="space-y-px">
                        {experiences.map((exp) => (
                            <div key={exp._id} className="px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                                <ExperienceCard
                                    exp={exp}
                                    onEdit={handleEdit}
                                    onDelete={() => setDeleteId(exp._id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <ExperienceModal
                    userId="692c1bcad78af0b697d71f34"
                    onClose={() => setShowModal(false)}
                    onSaved={handleSaved}
                    experienceToEdit={editExperience}
                />
            )}

            {deleteId && (
                <DeleteConfirmModal
                    message="Are you sure you want to delete this experience?"
                    onCancel={() => setDeleteId(null)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default ExperiencePage;