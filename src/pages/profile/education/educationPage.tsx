import React, {useEffect, useState} from "react";
import {Education} from "@dtos/education";
import {educationService} from "../../../services/education.service.ts";
import EducationCard from "./educationCard.tsx";
import EducationModal from "./educationModal";
import DeleteConfirmModal from "../../../components/common/deleteConfirmModal";

const EducationPage: React.FC = () => {
    const [data, setData] = useState<Education[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await educationService.getAll();
            const educations: Education[] = res.educations || [];

            educations.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
            setData(educations);
        } catch (err) {
            console.error("Failed to load education:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        await educationService.delete(deleteId);
        setDeleteId(null);
        load();
    };

    return (
        <div className="card">
            <div className="card-header flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold">Education ({data.length})</h4>
                <button onClick={() => setOpen(true)} className="btn btn-primary px-4 py-2">
                    Add Education
                </button>
            </div>
            <div className={'card-body'}>
                {loading ? (
                    <p>Loading...</p>
                ) : data.length === 0 ? (
                    <p className="text-gray-500">No education found.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {data.map(edu => (
                            <EducationCard
                                key={edu._id}
                                edu={edu}
                                onDelete={() => setDeleteId(edu._id)}
                                onEdit={(e) => {
                                    setEditingEducation(e);
                                    setOpen(true);
                                }}
                            />
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
                    onSaved={load}
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
