import React, {useState, useEffect} from "react";
import {educationService, Education, CreateEducationData} from "../../../services/education.service.ts";
import {BookOpen, BookMarked, Calendar, FileText, GraduationCap, Loader2, Mic, MicOff, X} from "lucide-react";
import toast from "react-hot-toast";
import {useSpeechFill} from "@hooks/useSpeechFill.ts";

interface Props {
    onClose: () => void;
    onSaved: () => void;
    educationToEdit?: Education;
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

type TextField = "school" | "degree" | "fieldOfStudy" | "description";

const EducationModal: React.FC<Props> = ({onClose, onSaved, educationToEdit}) => {
    const [form, setForm] = useState<CreateEducationData>({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const { supported, listening, transcript, startListening, stopListening, resetTranscript } = useSpeechFill();
    const [activeField, setActiveField] = useState<TextField | null>(null);

    useEffect(() => {
        if (educationToEdit) {
            setForm({
                school: educationToEdit.school || "",
                degree: educationToEdit.degree || "",
                fieldOfStudy: educationToEdit.fieldOfStudy || "",
                startDate: educationToEdit.startDate ? educationToEdit.startDate.slice(0, 7) : "",
                endDate: educationToEdit.endDate ? educationToEdit.endDate.slice(0, 7) : "",
                description: educationToEdit.description || "",
            });
        }
    }, [educationToEdit]);

    // When recognition stops, write transcript into the active field
    useEffect(() => {
        if (!listening && activeField && transcript) {
            setForm(prev => ({...prev, [activeField]: transcript}));
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.school || !form.degree || !form.startDate) {
            toast.error("School, degree and start date are required");
            return;
        }
        setLoading(true);
        try {
            if (educationToEdit) {
                await educationService.update(educationToEdit._id, form);
            } else {
                await educationService.create(form);
            }
            onSaved();
            onClose();
        } catch (err) {
            toast.error("Failed to save education");
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
                        {educationToEdit ? "Edit Education" : "Add Education"}
                    </h4>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-dark-500 dark:hover:text-dark-200 transition-colors"
                    >
                        <X size={18}/>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <FormField label="Institution" icon={<GraduationCap size={14}/>}>
                        <input
                            type="text"
                            name="school"
                            value={form.school}
                            onChange={handleChange}
                            placeholder="e.g. MIT"
                            className={supported ? inputMicCls : inputCls}
                            disabled={loading}
                        />
                        <MicBtn field="school"/>
                    </FormField>

                    <FormField label="Degree" icon={<BookOpen size={14}/>}>
                        <input
                            type="text"
                            name="degree"
                            value={form.degree}
                            onChange={handleChange}
                            placeholder="e.g. Bachelor of Science"
                            className={supported ? inputMicCls : inputCls}
                            disabled={loading}
                        />
                        <MicBtn field="degree"/>
                    </FormField>

                    <FormField label="Field of Study" icon={<BookMarked size={14}/>}>
                        <input
                            type="text"
                            name="fieldOfStudy"
                            value={form.fieldOfStudy}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science"
                            className={supported ? inputMicCls : inputCls}
                            disabled={loading}
                        />
                        <MicBtn field="fieldOfStudy"/>
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Start Date" icon={<Calendar size={14}/>}>
                            <input
                                type="month"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                className={inputCls}
                                disabled={loading}
                            />
                        </FormField>

                        <FormField label="End Date" icon={<Calendar size={14}/>}>
                            <input
                                type="month"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                className={inputCls}
                                disabled={loading}
                            />
                        </FormField>
                    </div>

                    <div className="space-y-1.5">
                        <label className={labelCls}>Description</label>
                        <div className="relative">
                            <span className="absolute top-2.5 left-3 pointer-events-none text-gray-400 dark:text-dark-500">
                                <FileText size={14}/>
                            </span>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Relevant coursework, thesis, achievements..."
                                className={`${supported ? inputMicCls : inputCls} resize-none pt-2.5`}
                                disabled={loading}
                            />
                            <MicBtn field="description"/>
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
                            ? <><Loader2 size={14} className="animate-spin"/>Saving...</>
                            : educationToEdit ? "Update" : "Add"
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EducationModal;
