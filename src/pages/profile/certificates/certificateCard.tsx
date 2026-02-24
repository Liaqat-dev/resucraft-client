import React from "react";
import { Certificate } from "@dtos/userProfile.ts";
import { Award, Edit2, ExternalLink, Trash2 } from "lucide-react";

interface Props {
    certificate: Certificate;
    onDelete: () => void;
    onEdit: (cert: Certificate) => void;
}

const fmt = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
        month: "short",
        year: "numeric",
    });
};

const isExpired = (expiryDate?: string): boolean => {
    if (!expiryDate) return false;
    const [year, month] = expiryDate.split("-");
    return new Date(Number(year), Number(month) - 1) < new Date();
};

const CertificateCard: React.FC<Props> = ({ certificate, onDelete, onEdit }) => {
    const expired = isExpired(certificate.expiryDate);

    return (
        <div className="relative pl-4 before:absolute before:left-0 before:inset-y-0 before:w-0.5 before:rounded-full before:bg-amber-400 dark:before:bg-amber-500">
            {/* Top row: name + issue date */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-dark-100 leading-snug">
                        {certificate.name}
                    </p>
                    {expired && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                            Expired
                        </span>
                    )}
                </div>
                <span className="text-xs text-gray-400 dark:text-dark-500 whitespace-nowrap shrink-0">
                    {fmt(certificate.issueDate)}
                    {certificate.expiryDate && ` – ${fmt(certificate.expiryDate)}`}
                </span>
            </div>

            {/* Issuer · Credential ID */}
            <p className="mt-0.5 text-xs text-gray-500 dark:text-dark-400">
                <span className="inline-flex items-center gap-1">
                    <Award size={10} className="text-amber-400 shrink-0" />
                    {certificate.issuer}
                </span>
                {certificate.credentialId && (
                    <span className="before:content-['·'] before:mx-1.5 before:text-gray-300 dark:before:text-dark-600">
                        ID: {certificate.credentialId}
                    </span>
                )}
            </p>

            {/* Description + links + actions */}
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-dark-800 flex items-end justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {certificate.description && (
                        <p className="text-xs text-gray-500 dark:text-dark-400 leading-relaxed line-clamp-2 mb-1.5">
                            {certificate.description}
                        </p>
                    )}
                    {certificate.credentialUrl && (
                        <a
                            href={certificate.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            <ExternalLink size={11} />
                            View Credential
                        </a>
                    )}
                </div>
                <Actions onEdit={() => onEdit(certificate)} onDelete={onDelete} />
            </div>
        </div>
    );
};

const Actions: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => (
    <div className="flex items-center gap-0.5 shrink-0">
        <button
            onClick={onEdit}
            className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-500/10 transition-colors"
            title="Edit"
        >
            <Edit2 size={13} />
        </button>
        <button
            onClick={onDelete}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Delete"
        >
            <Trash2 size={13} />
        </button>
    </div>
);

export default CertificateCard;