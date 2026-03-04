import React, { useEffect, useState } from "react";
import { Certificate } from "@dtos/userProfile.ts";
import { useProfile } from "@src/hooks/useProfile.ts";
import CertificateCard from "./certificateCard.tsx";
import CertificateModal from "./certificateModal.tsx";
import DeleteConfirmModal from "@src/components/common/deleteConfirmModal";
import { Award, Plus } from "lucide-react";
import toast from "react-hot-toast";

// ── Skeleton ───────────────────────────────────────────────────────────────────

const Skeleton: React.FC = () => (
    <div className="space-y-3">
        {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 rounded-lg border border-gray-100 dark:border-dark-800 animate-pulse">
                <div className="size-10 rounded-md bg-gray-100 dark:bg-dark-800 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-48 bg-gray-200 dark:bg-dark-700 rounded" />
                    <div className="h-3 w-28 bg-gray-100 dark:bg-dark-800 rounded" />
                    <div className="h-3 w-36 bg-gray-100 dark:bg-dark-800 rounded" />
                </div>
            </div>
        ))}
    </div>
);

// ── Empty state ────────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="size-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-3">
            <Award size={20} className="text-amber-400 dark:text-amber-500" />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-dark-300 mb-1">No certificates yet</p>
        <p className="text-xs text-gray-400 dark:text-dark-500 mb-4">Add your certifications and credentials.</p>
        <button onClick={onAdd} className="btn btn-primary flex items-center gap-1.5">
            <Plus size={14} />
            Add Certificate
        </button>
    </div>
);

// ── Page ───────────────────────────────────────────────────────────────────────

const CertificatesPage: React.FC = () => {
    const { certificates, certificatesLoading, fetchCertificates, deleteCertificate } = useProfile();
    const [open, setOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certificate | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleAdd = () => {
        setEditingCert(undefined);
        setOpen(true);
    };

    const handleEdit = (cert: Certificate) => {
        setEditingCert(cert);
        setOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await deleteCertificate(deleteId).unwrap();
            toast.success("Certificate deleted");
        } catch {
            toast.error("Failed to delete certificate");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="card">
            <div className="card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-md bg-amber-50 dark:bg-amber-950 flex items-center justify-center shrink-0">
                        <Award size={15} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                        Certificates
                        {!certificatesLoading && certificates.length > 0 && (
                            <span className="ml-2 text-xs font-normal text-gray-400 dark:text-dark-500">
                                ({certificates.length})
                            </span>
                        )}
                    </h2>
                </div>
                {!certificatesLoading && certificates.length > 0 && (
                    <button onClick={handleAdd} className="btn btn-primary flex items-center gap-1.5">
                        <Plus size={14} />
                        Add
                    </button>
                )}
            </div>

            <div className="card-body">
                {certificatesLoading ? (
                    <Skeleton />
                ) : certificates.length === 0 ? (
                    <EmptyState onAdd={handleAdd} />
                ) : (
                    <div className="space-y-px">
                        {certificates.map((cert:Certificate) => (
                            <div
                                key={cert._id}
                                className="px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
                            >
                                <CertificateCard
                                    certificate={cert}
                                    onEdit={handleEdit}
                                    onDelete={() => setDeleteId(cert._id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {open && (
                <CertificateModal
                    onClose={() => {
                        setEditingCert(undefined);
                        setOpen(false);
                    }}
                    certToEdit={editingCert}
                />
            )}

            {deleteId && (
                <DeleteConfirmModal
                    message="Are you sure you want to delete this certificate?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
};

export default CertificatesPage;