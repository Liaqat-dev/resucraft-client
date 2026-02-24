import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import {Eye, EyeOff, KeyRound, Loader2, Lock, Mail, ShieldAlert, Trash2, Upload, User} from "lucide-react";
import {NextPageWithLayout} from "@dtos/layout";
import user17 from "@assets/images/avatar/user-17.png";
import {useSelector} from "react-redux";
import {RootState} from "@src/slices/store.ts";
import toast from "react-hot-toast";
import {useAuth} from "@hooks/useAuth.ts";

// ── Shared input class builder (mirrors personalInfoPage Field) ────────────────

function inputCls(error?: string) {
    return [
        "w-full pl-9 pr-4 py-2.5 text-sm rounded-md border",
        "bg-white dark:bg-dark-900 dark:text-dark-100",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        error
            ? "border-red-400 dark:border-red-500 focus:ring-red-400/30 focus:border-red-400"
            : "border-gray-200 dark:border-dark-800 hover:border-gray-300 dark:hover:border-dark-700 focus:ring-primary-500/20 focus:border-primary-500",
    ].join(" ");
}

// ── Field (text / email) ───────────────────────────────────────────────────────

interface FieldProps {
    label: string;
    id: string;
    name?: string;
    type?: string;
    icon: React.ReactNode;
    placeholder?: string;
    value: string;
    error?: string;
    readOnly?: boolean;
    disabled?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Field: React.FC<FieldProps> = ({
    label, id, name, type = "text", icon, placeholder,
    value, error, readOnly, disabled, onChange,
}) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400">
            {label}
        </label>
        <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-dark-500">
                {icon}
            </span>
            <input
                id={id}
                name={name ?? id}
                type={type}
                value={value}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                onChange={onChange}
                className={`${inputCls(error)} ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
            />
        </div>
        {error && (
            <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                <span className="inline-block size-1 rounded-full bg-red-500 dark:bg-red-400"/>
                {error}
            </p>
        )}
    </div>
);

// ── PasswordField ──────────────────────────────────────────────────────────────

interface PasswordFieldProps {
    label: string;
    id: string;
    value: string;
    visible: boolean;
    error?: string;
    hint?: { text: string; ok: boolean } | null;
    placeholder?: string;
    autoComplete?: string;
    disabled?: boolean;
    onToggle: () => void;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    label, id, value, visible, error, hint, placeholder,
    autoComplete, disabled, onToggle, onChange,
}) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400">
            {label}
        </label>
        <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-dark-500">
                <KeyRound size={14}/>
            </span>
            <input
                id={id}
                type={visible ? "text" : "password"}
                value={value}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                onChange={onChange}
                className={[
                    "w-full pl-9 pr-10 py-2.5 text-sm rounded-md border",
                    "bg-white dark:bg-dark-900 dark:text-dark-100",
                    "transition-colors duration-150",
                    "focus:outline-none focus:ring-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    error
                        ? "border-red-400 dark:border-red-500 focus:ring-red-400/30 focus:border-red-400"
                        : hint?.ok === true
                            ? "border-emerald-400 dark:border-emerald-500 focus:ring-emerald-400/30 focus:border-emerald-400"
                            : "border-gray-200 dark:border-dark-800 hover:border-gray-300 dark:hover:border-dark-700 focus:ring-primary-500/20 focus:border-primary-500",
                ].join(" ")}
            />
            <button
                type="button"
                onClick={onToggle}
                tabIndex={-1}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-dark-500 dark:hover:text-dark-300 focus:outline-none transition-colors"
            >
                {visible ? <EyeOff size={14}/> : <Eye size={14}/>}
            </button>
        </div>
        {error && (
            <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                <span className="inline-block size-1 rounded-full bg-red-500 dark:bg-red-400"/>
                {error}
            </p>
        )}
        {!error && hint && (
            <p className={`text-xs font-medium flex items-center gap-1 ${hint.ok ? "text-emerald-500" : "text-red-500"}`}>
                <span className={`inline-block size-1 rounded-full ${hint.ok ? "bg-emerald-500" : "bg-red-500"}`}/>
                {hint.text}
            </p>
        )}
    </div>
);

// ── Password strength ──────────────────────────────────────────────────────────

function getStrength(pw: string): { score: number; label: string; colorClass: string } {
    if (!pw) return {score: 0, label: "", colorClass: ""};
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 1) return {score: 1, label: "Weak", colorClass: "bg-red-500"};
    if (s <= 2) return {score: 2, label: "Fair", colorClass: "bg-amber-400"};
    if (s <= 3) return {score: 3, label: "Good", colorClass: "bg-yellow-400"};
    if (s <= 4) return {score: 4, label: "Strong", colorClass: "bg-emerald-400"};
    return {score: 5, label: "Very Strong", colorClass: "bg-emerald-500"};
}

// ── Section label ──────────────────────────────────────────────────────────────

const SectionLabel = ({icon, index, title, description}: {
    icon: React.ReactNode;
    index: string;
    title: string;
    description: string;
}) => (
    <div className="col-span-12 xl:col-span-3">
        <div className="flex items-start gap-3 xl:flex-col">
            <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center justify-center rounded-lg w-8 h-8 bg-primary-500/10 text-primary">
                    {icon}
                </span>
                <span className="text-xs font-mono text-gray-400 dark:text-dark-500">{index}</span>
            </div>
            <div>
                <h6 className="card-title mb-1">{title}</h6>
                <p className="text-xs text-gray-500 dark:text-dark-500 leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const AccountSettings: NextPageWithLayout = () => {
    const {user, updateAccountInfo, changePassword} = useAuth();
    const authUser = useSelector((state: RootState) => state.auth.user);

    // ── Profile section ──────────────────────────────────────────
    const [username, setUserName] = useState("");
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [profileSubmitting, setProfileSubmitting] = useState(false);
    // ── Password section ─────────────────────────────────────────
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);

    const passwordStrength = useMemo(() => getStrength(newPassword), [newPassword]);
    const passwordsMatch = confirmPassword ? newPassword === confirmPassword : null;

    useEffect(() => {
        document.title = "Account Settings | ResuCraft";
    }, []);

    useEffect(() => {
        if (user?.username) setUserName(user.username);
        if (user?.profilePic) setPhotoPreview(user.profilePic);
    }, [user]);

    const handleChangeAccountInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            toast.error("Username is required");
            return;
        }
        setProfileSubmitting(true);
        try {
            await updateAccountInfo({username, file: selectedFile}).unwrap();
            toast.success("Profile updated successfully");
            setSelectedFile(null);
        } catch (err: any) {
            toast.error(err?.message || "Failed to update profile");
        } finally {
            setProfileSubmitting(false);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }
        setPasswordSubmitting(true);
        try {
            await changePassword({currentPassword, newPassword}).unwrap();
            toast.success("Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            toast.error(err?.message || "Failed to update password");
        } finally {
            setPasswordSubmitting(false);
        }
    };

    const avatarSrc = photoPreview ?? user?.profilePic?.url ?? user17;

    return (
        <div className="space-y-5 mt-5">
            {/* ── Account Information ───────────────────────────────── */}
            <div className="card">
                <div className="card-body">
                    <div className="grid grid-cols-12 gap-6">
                        <SectionLabel
                            icon={<User size={14}/>}
                            index="01"
                            title="Account Information"
                            description="Update your public profile and display picture."
                        />
                        <div className="col-span-12 xl:col-span-9">
                            <form onSubmit={handleChangeAccountInfo}>
                                <div className="flex flex-col sm:flex-row gap-6 mb-6 items-start">
                                    {/* Avatar with hover-overlay upload */}
                                    <label className="cursor-pointer group relative shrink-0">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <div className="relative w-20 h-20">
                                            <img
                                                className="object-cover rounded-full w-20 h-20 ring-2 ring-offset-2 ring-primary/20 dark:ring-offset-dark-900"
                                                src={avatarSrc}
                                                alt="Profile photo"
                                            />
                                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Upload size={16} className="text-white"/>
                                            </div>
                                        </div>
                                        <span className="block mt-1.5 text-xs text-center text-gray-400 group-hover:text-primary transition-colors">
                                            Change photo
                                        </span>
                                    </label>

                                    {/* Fields */}
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                        <Field
                                            label="Username"
                                            id="usernameInput"
                                            name="username"
                                            icon={<User size={14}/>}
                                            placeholder="Enter your username"
                                            value={username}
                                            disabled={profileSubmitting}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                        <Field
                                            label="Email Address"
                                            id="emailInput"
                                            name="email"
                                            type="email"
                                            icon={<Mail size={14}/>}
                                            value={authUser?.email ?? ""}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={profileSubmitting}
                                        className="btn btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {profileSubmitting ? (
                                            <><Loader2 size={14} className="animate-spin"/>Saving...</>
                                        ) : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Update Password ───────────────────────────────────── */}
            <div className="card">
                <div className="card-body">
                    <div className="grid grid-cols-12 gap-6">
                        <SectionLabel
                            icon={<Lock size={14}/>}
                            index="02"
                            title="Update Password"
                            description="Use a strong password you don't reuse elsewhere."
                        />
                        <div className="col-span-12 xl:col-span-9">
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <PasswordField
                                    label="Current Password"
                                    id="settingsCurrentPasswordInput"
                                    value={currentPassword}
                                    visible={currentPasswordVisible}
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                    disabled={passwordSubmitting}
                                    onToggle={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />

                                <div>
                                    <PasswordField
                                        label="New Password"
                                        id="settingsNewPasswordInput"
                                        value={newPassword}
                                        visible={newPasswordVisible}
                                        placeholder="New password"
                                        autoComplete="new-password"
                                        disabled={passwordSubmitting}
                                        onToggle={() => setNewPasswordVisible(!newPasswordVisible)}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    {newPassword && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 mb-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                            i <= passwordStrength.score
                                                                ? passwordStrength.colorClass
                                                                : "bg-gray-200 dark:bg-dark-600"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className={`text-xs font-medium ${
                                                passwordStrength.score <= 2 ? "text-red-500" :
                                                    passwordStrength.score <= 3 ? "text-amber-500" : "text-emerald-500"
                                            }`}>
                                                {passwordStrength.label}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <PasswordField
                                    label="Confirm New Password"
                                    id="settingsConfirmPasswordInput"
                                    value={confirmPassword}
                                    visible={confirmPasswordVisible}
                                    placeholder="Confirm password"
                                    autoComplete="new-password"
                                    disabled={passwordSubmitting}
                                    hint={
                                        passwordsMatch === null ? null :
                                            {ok: passwordsMatch, text: passwordsMatch ? "Passwords match" : "Passwords do not match"}
                                    }
                                    onToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                                <div className="flex justify-end pt-1">
                                    <button
                                        type="submit"
                                        disabled={passwordSubmitting}
                                        className="btn btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {passwordSubmitting ? (
                                            <><Loader2 size={14} className="animate-spin"/>Updating...</>
                                        ) : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Danger Zone ───────────────────────────────────────── */}
            <div className="card border border-red-200 dark:border-red-500/20">
                <div className="card-body">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 xl:col-span-3">
                            <div className="flex items-start gap-3 xl:flex-col">
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="flex items-center justify-center rounded-lg w-8 h-8 bg-red-100 dark:bg-red-500/10 text-red-500">
                                        <ShieldAlert size={14}/>
                                    </span>
                                    <span className="text-xs font-mono text-gray-400 dark:text-dark-500">03</span>
                                </div>
                                <div>
                                    <h6 className="card-title text-red-600 dark:text-red-400 mb-1">Danger Zone</h6>
                                    <p className="text-xs text-gray-500 dark:text-dark-500 leading-relaxed">
                                        Irreversible and destructive actions.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 xl:col-span-9">
                            <div className="rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-dark-100 mb-1">
                                            Delete this account
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-dark-500 leading-relaxed">
                                            Once you delete your account, there is no going back. All your
                                            resumes and data will be permanently removed.
                                        </p>
                                    </div>
                                    <button className="btn btn-red shrink-0 flex items-center gap-1.5">
                                        <Trash2 size={14}/>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AccountSettings;