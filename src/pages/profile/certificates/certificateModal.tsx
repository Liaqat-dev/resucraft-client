import React, { useEffect, useState } from "react";
import { Certificate, CreateCertificateData } from "@dtos/userProfile.ts";
import { Award, Calendar, FileText, Hash, Link as LinkIcon, Loader2, Mic, MicOff, X } from "lucide-react";
import toast from "react-hot-toast";
import { useProfile } from "@src/hooks/useProfile.ts";
import { useSpeechFill } from "@hooks/useSpeechFill.ts";

interface Props {
    onClose: () => void;
    certToEdit?: Certificate;
}

const inputCls =
    "w-full pl-9 pr-4 py-2.5 text-sm rounded-md border " +
    "bg-white dark:bg-dark-900 dark:text-dark-100 " +
    "transition-colors duration-150 focus:outline-none focus:ring-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed " +
    "border-gray-200 dark:border-dark-800 hover:border-gray-300 dark:hover:border-dark-700 " +
    "focus:ring-primary-500/20 focus:border-primary-500";

const inputMicCls = inputCls.replace("pr-4", "pr-9");

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

type TextField = "name" | "issuer" | "credentialId" | "description";

const CertificateModal: React.FC<Props> = ({ onClose, certToEdit }) => {
    const { createCertificate, editCertificate } = useProfile();

    const [form, setForm] = useState<CreateCertificateData>({
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const { supported, listening, transcript, startListening, stopListening, resetTranscript } = useSpeechFill();
    const [activeField, setActiveField] = useState<TextField | null>(null);

    useEffect(() => {
        if (certToEdit) {
            setForm({
                name: certToEdit.name,
                issuer: certToEdit.issuer,
                issueDate: certToEdit.issueDate || "",
                expiryDate: certToEdit.expiryDate || "",
                credentialId: certToEdit.credentialId || "",
                credentialUrl: certToEdit.credentialUrl || "",
                description: certToEdit.description || "",
            });
        }
    }, [certToEdit]);

    // When recognition stops, write transcript into the active field
    useEffect(() => {
        if (!listening && activeField && transcript) {
            setForm(prev => ({ ...prev, [activeField]: transcript }));
            setActiveField(null);
            resetTranscript();
        }
    }, [listening]);

    const handleMic = (field: TextField) => {
        if (listening && activeField === field) {
            stopListening();
        } else {
            setActiveField(field);
            startListening();
        }
    };

    const MicBtn: React.FC<{ field: TextField }> = ({ field }) => {
        if (!supported) return null;
        const active = listening && activeField === field;
        return (
            <button
                type="button"
                onClick={() => handleMic(field)}
                title={active ? "Stop listening" : "Speak to fill"}
                className={`absolute inset-y-0 right-2 flex items-center transition-colors
                    ${active ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-primary-500"}`}
            >
                {active ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
        );
    };

    const set = (field: keyof CreateCertificateData, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.issuer.trim() || !form.issueDate) {
            toast.error("Name, issuer, and issue date are required");
            return;
        }
        setLoading(true);
        try {
            if (certToEdit) {
                await editCertificate(certToEdit._id, form).unwrap();
            } else {
                await createCertificate(form).unwrap();
            }
            onClose();
        } catch (err: any) {
            toast.error(err?.message || "Failed to save certificate");
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
                        {certToEdit ? "Edit Certificate" : "Add Certificate"}
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
                    <FormField label="Certificate Name" icon={<Award size={14} />}>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="e.g. AWS Solutions Architect"
                            className={supported ? inputMicCls : inputCls}
                            disabled={loading}
                            autoFocus
                        />
                        <MicBtn field="name" />
                    </FormField>

                    <FormField label="Issuing Organisation" icon={<Award size={14} />}>
                        <input
                            type="text"
                            value={form.issuer}
                            onChange={(e) => set("issuer", e.target.value)}
                            placeholder="e.g. Amazon Web Services"
                            className={supported ? inputMicCls : inputCls}
                            disabled={loading}
                        />
                        <MicBtn field="issuer" />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Issue Date" icon={<Calendar size={14} />}>
                            <input
                                type="month"
                                value={form.issueDate}
                                onChange={(e) => set("issueDate", e.target.value)}
                                className={inputCls}
                                disabled={loading}
                            />
                        </FormField>
                        <FormField label="Expiry Date" icon={<Calendar size={14} />}>
                            <input
                                type="month"
                                value={form.expiryDate}
                                onChange={(e) => set("expiryDate", e.target.value)}
                                className={inputCls}
                                disabled={loading}
                            />
                        </FormField>
                    </div>

                    <FormField label="Credential ID" icon={<Hash size={14} />}>
                        <input
                            type="text"
                            value={form.credentialId}
                            onChange={(e) => set("credentialId", e.target.value)}
                            placeholder="e.g. ABC123XYZ"
                            className={supported ? inputMicCls : inputCls}
                            disabled={loading}
                        />
                        <MicBtn field="credentialId" />
                    </FormField>

                    <FormField label="Credential URL" icon={<LinkIcon size={14} />}>
                        <input
                            type="url"
                            value={form.credentialUrl}
                            onChange={(e) => set("credentialUrl", e.target.value)}
                            placeholder="https://verify.example.com/..."
                            className={inputCls}
                            disabled={loading}
                        />
                    </FormField>

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
                                placeholder="Optional notes about this certification..."
                                className={`${supported ? inputMicCls : inputCls} resize-none pt-2.5`}
                                disabled={loading}
                            />
                            <MicBtn field="description" />
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
                            : certToEdit ? "Update" : "Add"
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CertificateModal;
