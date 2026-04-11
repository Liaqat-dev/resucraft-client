import React, {useState, useEffect} from "react";
import {Experience, CreateExperienceData} from "@dtos/index.ts";
import {experienceService} from "@src/services/experience.service.ts";
import {Briefcase, Building2, Calendar, FileText, Loader2, Mic, MicOff, X} from "lucide-react";
import toast from "react-hot-toast";
import {useSpeechFill} from "@hooks/useSpeechFill.ts";

interface Props {
    userId: string;
    onClose: () => void;
    onSaved: () => void;
    experienceToEdit?: Experience;
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
const iconCls  = "absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-dark-500";

interface FieldProps {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}
const FormField: React.FC<FieldProps> = ({label, icon, children}) => (
    <div className="space-y-1.5">
        <label className={labelCls}>{label}</label>
        <div className="relative">
            <span className={iconCls}>{icon}</span>
            {children}
        </div>
    </div>
);

type TextField = "company" | "role" | "description";

const ExperienceModal: React.FC<Props> = ({userId, onClose, onSaved, experienceToEdit}) => {
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentlyWorking, setCurrentlyWorking] = useState(false);
    const [loading, setLoading] = useState(false);

    const { supported, listening, transcript, startListening, stopListening, resetTranscript } = useSpeechFill();
    const [activeField, setActiveField] = useState<TextField | null>(null);

    useEffect(() => {
        if (experienceToEdit) {
            setCompany(experienceToEdit.company);
            setRole(experienceToEdit.role);
            setDescription(experienceToEdit.description || "");
            setStartDate(experienceToEdit.startDate.substring(0, 7));
            setEndDate(experienceToEdit.endDate ? experienceToEdit.endDate.substring(0, 7) : "");
            setCurrentlyWorking(experienceToEdit.currentlyWorking);
        }
    }, [experienceToEdit]);

    // When recognition stops, write transcript into the active field
    useEffect(() => {
        if (!listening && activeField && transcript) {
            if (activeField === "company") setCompany(transcript);
            else if (activeField === "role") setRole(transcript);
            else if (activeField === "description") setDescription(transcript);
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

    const MicBtn: React.FC<{field: TextField}> = ({field}) => {
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
                {active ? <MicOff size={14}/> : <Mic size={14}/>}
            </button>
        );
    };

    const handleSave = async () => {
        if (!company || !role || !startDate) {
            toast.error("Company, role and start date are required");
            return;
        }
        setLoading(true);
        const payload: CreateExperienceData = {
            userId,
            company,
            role,
            description,
            startDate,
            endDate: currentlyWorking ? undefined : endDate,
            currentlyWorking,
        };
        try {
            if (experienceToEdit) {
                await experienceService.updateExperience(experienceToEdit._id, payload);
            } else {
                await experienceService.createExperience(payload);
            }
            onSaved();
        } catch (err) {
            toast.error("Failed to save experience");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-700 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-600 shrink-0">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                        {experienceToEdit ? "Edit Experience" : "Add Experience"}
                    </h4>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-dark-500 dark:hover:text-dark-200 transition-colors"
                    >
                        <X size={18}/>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <FormField label="Company" icon={<Building2 size={14}/>}>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="e.g. Acme Corp"
                            className={supported ? inputMicCls : inputCls}
                            disabled={loading}
                        />
                        <MicBtn field="company"/>
                    </FormField>

                    <FormField label="Role" icon={<Briefcase size={14}/>}>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Software Engineer"
                            className={supported ? inputMicCls : inputCls}
                            disabled={loading}
                        />
                        <MicBtn field="role"/>
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Start Date" icon={<Calendar size={14}/>}>
                            <input
                                type="month"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={inputCls}
                                disabled={loading}
                            />
                        </FormField>

                        <FormField label="End Date" icon={<Calendar size={14}/>}>
                            {currentlyWorking ? (
                                <input
                                    type="text"
                                    value="Present"
                                    readOnly
                                    className={`${inputCls} opacity-60 cursor-not-allowed`}
                                />
                            ) : (
                                <input
                                    type="month"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={inputCls}
                                    disabled={loading}
                                />
                            )}
                        </FormField>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={currentlyWorking}
                            onChange={(e) => setCurrentlyWorking(e.target.checked)}
                            className="checkbox checkbox-primary"
                        />
                        <span className="text-sm text-gray-700 dark:text-dark-200">
                            Currently working here
                        </span>
                    </label>

                    <div className="space-y-1.5">
                        <label className={labelCls}>Description</label>
                        <div className="relative">
                            <span className="absolute top-2.5 left-3 pointer-events-none text-gray-400 dark:text-dark-500">
                                <FileText size={14}/>
                            </span>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Describe your responsibilities and achievements..."
                                className={`${supported ? inputMicCls : inputCls} resize-none pt-2.5`}
                                disabled={loading}
                            />
                            <MicBtn field="description"/>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-dark-600 shrink-0">
                    <button onClick={onClose} className="btn btn-outline" disabled={loading}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="btn btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? <><Loader2 size={14} className="animate-spin"/>Saving...</>
                            : experienceToEdit ? "Update" : "Save"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExperienceModal;
