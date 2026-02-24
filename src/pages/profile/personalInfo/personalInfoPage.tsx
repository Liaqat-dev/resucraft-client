import React, { useEffect, useState } from "react";
import type { PersonalInfo } from "@dtos/index.ts";
import toast, { Toaster } from "react-hot-toast";
import {
    BriefcaseBusiness,
    Calendar,
    FileText,
    Github,
    Linkedin,
    Loader2,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";
import { useProfile } from "@src/hooks/useProfile.ts";

// ── Types ─────────────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof PersonalInfo, string>>;
type TouchedFields = Partial<Record<keyof PersonalInfo, boolean>>;

// ── Validation ────────────────────────────────────────────────────────────────

const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s().\-]{7,20}$/;

function validate(form: PersonalInfo): FormErrors {
    const e: FormErrors = {};
    if (!form.firstName?.trim()) e.firstName = "First name is required.";
    if (!form.lastName?.trim()) e.lastName = "Last name is required.";
    if (!form.profession?.trim()) e.profession = "Profession is required.";
    if (form.email && !EMAIL_RE.test(form.email)) e.email = "Invalid email address.";
    if (form.phone && !PHONE_RE.test(String(form.phone))) e.phone = "Invalid phone number.";
    if (form.github && !URL_RE.test(form.github)) e.github = "Enter a valid URL.";
    if (form.linkedin && !URL_RE.test(form.linkedin)) e.linkedin = "Enter a valid URL.";
    return e;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

const Skeleton: React.FC = () => (
    <div className="card">
        <div className="card-header flex items-center gap-3">
            <div className="size-8 rounded-md bg-gray-100 animate-pulse" />
            <div className="h-5 w-44 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="card-body space-y-5">
            {[3, 3, 2, 1].map((cols, si) => (
                <div key={si} className="space-y-4">
                    <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse" />
                    <div className={`grid grid-cols-1 sm:grid-cols-${cols === 1 ? 1 : 2} gap-4`}>
                        {Array.from({ length: cols }).map((_, fi) => (
                            <div key={fi} className="space-y-1.5">
                                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                                <div className="h-10 w-full bg-gray-100 rounded-md animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="flex justify-end pt-1">
                <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse" />
            </div>
        </div>
    </div>
);

// ── Section Title ─────────────────────────────────────────────────────────────

const SectionHeading: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="pt-1">
        <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-dark-200">{title}</span>
            <span className="text-xs text-gray-400 dark:text-dark-500">{description}</span>
        </div>
        <div className="mt-2 h-px bg-gray-100 dark:bg-dark-800" />
    </div>
);

// ── Field ─────────────────────────────────────────────────────────────────────

interface FieldProps {
    label: string;
    name: keyof PersonalInfo;
    type?: string;
    icon: React.ReactNode;
    placeholder?: string;
    value: string;
    error?: string;
    disabled?: boolean;
    textarea?: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const Field: React.FC<FieldProps> = ({
    label,
    name,
    type = "text",
    icon,
    placeholder,
    value,
    error,
    disabled,
    textarea,
    onChange,
    onBlur,
}) => {
    const baseInput = [
        "w-full pl-9 pr-4 py-2.5 text-sm rounded-md border",
        "bg-white dark:bg-dark-900 dark:text-dark-100",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        error
            ? "border-red-400 dark:border-red-500 focus:ring-red-400/30 focus:border-red-400"
            : "border-gray-200 dark:border-dark-800 hover:border-gray-300 dark:hover:border-dark-700 focus:ring-primary-500/20 focus:border-primary-500",
    ].join(" ");

    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400">
                {label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-dark-500">
                    {icon}
                </span>
                {textarea ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        placeholder={placeholder}
                        rows={3}
                        className={`${baseInput} resize-none pt-2.5`}
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={baseInput}
                    />
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block size-1 rounded-full bg-red-500 dark:bg-red-400" />
                    {error}
                </p>
            )}
        </div>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const EMPTY_FORM: PersonalInfo = {
    firstName: "",
    lastName: "",
    dob: "",
    profession:"",
    bio: "",
    email: "",
    address: "",
    phone: "",
    github: "",
    linkedin: "",
};

const PersonalInfoPage: React.FC = () => {
    const { fetchPersonalInfo, savePersonalInfo } = useProfile();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<PersonalInfo>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});

    useEffect(() => {
        fetchPersonalInfo()
            .unwrap()
            .then((data) => {
                setForm({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    profession: data.profession || "",
                    address: data.address || "",
                    dob: data.dob ? data.dob.split("T")[0] : "",
                    bio: data.bio || "",
                    phone: data.phone ? String(data.phone) : "",
                    github: data.github || "",
                    linkedin: data.linkedin || "",
                });
            })
            .catch(() => toast.error("Failed to load profile data."))
            .finally(() => setIsLoading(false));
    }, []);

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        if (isSubmitting) return;
        const { name, value } = e.target;
        const key = name as keyof PersonalInfo;
        const updated = { ...form, [key]: value };
        setForm(updated);
        if (touched[key]) {
            setErrors((prev) => ({ ...prev, [key]: validate(updated)[key] }));
        }
    };

    const handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        const key = e.target.name as keyof PersonalInfo;
        setTouched((prev) => ({ ...prev, [key]: true }));
        setErrors((prev) => ({ ...prev, [key]: validate(form)[key] }));
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const allTouched = Object.keys(form).reduce<TouchedFields>(
            (acc, k) => ({ ...acc, [k]: true }),
            {}
        );
        setTouched(allTouched);

        const validationErrors = validate(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Please fix the highlighted errors.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Saving changes...");
        try {
            await savePersonalInfo(form).unwrap();
            toast.success("Profile updated successfully!", { id: toastId });
        } catch (err: any) {
            toast.error(
                "Update failed: " + (err?.message || "Something went wrong"),
                { id: toastId }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Skeleton />;

    /** Returns the string value for a PersonalInfo field. */
    const val = (key: keyof PersonalInfo): string =>
        form[key] != null ? String(form[key]) : "";

    /** Common props for every Field. */
    const fp = (key: keyof PersonalInfo) => ({
        name: key,
        value: val(key),
        error: touched[key] ? errors[key] : undefined,
        disabled: isSubmitting,
        onChange: handleChange,
        onBlur: handleBlur,
    });

    return (
        <div className="card">
            <Toaster position="top-right" />

            <div className="card-header flex items-center gap-3">
                <div className="size-8 rounded-md bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                    <User size={15} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                    Personal Information
                </h2>
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                    {/* ── Basic Details ──────────────────────────────────────── */}
                    <SectionHeading title="Basic Details" description="Your name and date of birth" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                            label="First Name"
                            icon={<User size={14} />}
                            placeholder="John"
                            {...fp("firstName")}
                        />
                        <Field
                            label="Last Name"
                            icon={<User size={14} />}
                            placeholder="Doe"
                            {...fp("lastName")}
                        />
                        <Field
                            label="Date of Birth"
                            type="date"
                            icon={<Calendar size={14} />}
                            {...fp("dob")}
                        />
                        <Field
                            label="Profession"
                            type="text"
                            icon={<BriefcaseBusiness size={14}/>}
                            {...fp("profession")}
                        />
                    </div>

                    {/* ── Contact ────────────────────────────────────────────── */}
                    <SectionHeading title="Contact Information" description="How people can reach you" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                            label="Email"
                            type="email"
                            icon={<Mail size={14} />}
                            placeholder="john@example.com"
                            {...fp("email")}
                        />
                        <Field
                            label="Phone Number"
                            type="tel"
                            icon={<Phone size={14} />}
                            placeholder="+1 234 567 890"
                            {...fp("phone")}
                        />
                        <div className="sm:col-span-2">
                            <Field
                                label="Address"
                                icon={<MapPin size={14} />}
                                placeholder="City, Country"
                                {...fp("address")}
                            />
                        </div>
                    </div>

                    {/* ── Social Links ───────────────────────────────────────── */}
                    <SectionHeading title="Social Links" description="GitHub and LinkedIn profiles" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                            label="GitHub URL"
                            icon={<Github size={14} />}
                            placeholder="https://github.com/username"
                            {...fp("github")}
                        />
                        <Field
                            label="LinkedIn URL"
                            icon={<Linkedin size={14} />}
                            placeholder="https://linkedin.com/in/username"
                            {...fp("linkedin")}
                        />
                    </div>

                    {/* ── Bio ────────────────────────────────────────────────── */}
                    <SectionHeading title="About You" description="Short bio for your resume" />
                    <Field
                        label="Bio"
                        textarea
                        icon={<FileText size={14} />}
                        placeholder="Write a short professional summary..."
                        {...fp("bio")}
                    />

                    {/* ── Submit ─────────────────────────────────────────────── */}
                    <div className="pt-1 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonalInfoPage;