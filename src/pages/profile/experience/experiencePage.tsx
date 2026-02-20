import React, { useEffect, useState } from "react";
import { Experience } from "@dtos/experience";
import { experienceService } from "../../../services/experience.service";
import ExperienceModal from "./experienceModal";
import ExperienceCard from "./experienceCard";
import DeleteConfirmModal from "../../../components/common/deleteConfirmModal.tsx";

const ExperiencePage: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editExperience, setEditExperience] = useState<Experience | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchExperiences = async () => {
        try {
            const data = await experienceService.getExperiences();
            setExperiences(data.experiences);
        } catch (err) {
            console.error(err);
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
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Experience</h2>
                <button onClick={handleAdd} className="btn btn-primary">
                    Add Experience
                </button>
            </div>

            {experiences.length === 0 ? (
                <p className="text-gray-500">No experiences added yet.</p>
            ) : (
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <ExperienceCard
                            key={exp._id}
                            exp={exp}
                            onEdit={handleEdit}
                            onDelete={() => setDeleteId(exp._id)}
                        />
                    ))}
                </div>
            )}

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