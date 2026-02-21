import React, {ChangeEvent, useEffect, useState} from "react";
import {Eye, EyeOff, Loader2, Upload} from "lucide-react";
import {NextPageWithLayout} from "@dtos/layout";
import user17 from "@assets/images/avatar/user-17.png";
import {useSelector} from "react-redux";
import {RootState} from "@src/slices/store.ts";
import {personalInfoService} from "@src/services/personalInfo.service";
import toast from "react-hot-toast";
import {useAuth} from "@hooks/useAuth.ts";

const AccountSettings: NextPageWithLayout = () => {
    const {changePassword}=useAuth()
    const authUser = useSelector((state: RootState) => state.auth.user);

    // ── Profile section ──────────────────────────────────────────
    const [name, setName] = useState("");
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileSubmitting, setProfileSubmitting] = useState(false);
    // ── Password section ─────────────────────────────────────────
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);

    useEffect(() => {
        document.title = "Account Settings | ResuCraft";
        loadPersonalInfo();
    }, []);

    const loadPersonalInfo = async () => {
        try {
            const info = await personalInfoService.get();
            setName(info.name ?? authUser?.name ?? "");
            if (info.profilePic) setPhotoPreview(info.profilePic);
        } catch {
            // fall back to auth user name silently
            setName(authUser?.name ?? "");
        } finally {
            setProfileLoading(false);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }
        setProfileSubmitting(true);
        try {
            await personalInfoService.update({
                name: name.trim(),
                ...(selectedFile ? {profilePic: selectedFile} : {}),
            });
            toast.success("Profile updated successfully");
            setSelectedFile(null);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update profile");
        } finally {
            setProfileSubmitting(false);
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

    return (
        <>
            {/* ── Account Information ──────────────────────────── */}
            <div className="mt-5 card">
                <div className="card-body">
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 xl:col-span-3">
                            <h6 className="card-title">Account Information</h6>
                        </div>
                        <div className="col-span-12 xl:col-span-9">
                            <form onSubmit={handleProfileSubmit}>
                                <div className="grid grid-cols-12 gap-5">
                                    <div className="col-span-12">
                                        <div>
                                            <div className="shrink-0">
                                                {profileLoading ? (
                                                    <div className="object-cover rounded-md size-20 bg-gray-100 dark:bg-dark-850 animate-pulse"/>
                                                ) : photoPreview ? (
                                                    <img
                                                        className="object-cover rounded-md size-20"
                                                        src={photoPreview}
                                                        alt="Selected profile photo"
                                                    />
                                                ) : (
                                                    <img
                                                        className="object-cover rounded-md size-20"
                                                        src={user17}
                                                        alt="Current profile photo"
                                                    />
                                                )}
                                            </div>
                                            <label className="block mt-4">
                                                <span className="sr-only">Choose profile photo</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <span
                                                    className="btn btn-sub-primary"
                                                >
                                                    <Upload className="inline-block size-4 me-1"/>
                                                    <span className="align-middle">Upload Profile</span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <label htmlFor="firstNameInput" className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstNameInput"
                                            name="name"
                                            className="form-input"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={profileLoading}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                        <label htmlFor="emailInput" className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="emailInput"
                                            name="email"
                                            className="form-input opacity-60 cursor-not-allowed"
                                            value={authUser?.email ?? ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-span-12 text-right">
                                        <button
                                            type="submit"
                                            disabled={profileSubmitting || profileLoading}
                                            className="btn btn-primary disabled:opacity-60"
                                        >
                                            {profileSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="size-4 animate-spin"/>
                                                    Saving...
                                                </span>
                                            ) : (
                                                "Update Profile"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Update Password ──────────────────────────────── */}
            <div className="mt-5 card">
                <div className="card-body">
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 xl:col-span-3">
                            <h6 className="card-title">Update Password</h6>
                        </div>
                        <div className="col-span-12 xl:col-span-9">
                            <div className="card-body">
                                <p className="mb-3 text-gray-500 dark:text-dark-500">
                                    To change your password, please enter your current password.
                                </p>
                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="mb-5">
                                        <label htmlFor="settingsCurrentPasswordInput" className="form-label">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={currentPasswordVisible ? "text" : "password"}
                                                id="settingsCurrentPasswordInput"
                                                className="ltr:pr-8 rtl:pl-8 form-input"
                                                autoComplete="current-password"
                                                placeholder="Enter current password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                                                className="absolute inset-y-0 flex items-center text-gray-500 dark:text-dark-500 ltr:right-3 rtl:left-3 focus:outline-none"
                                            >
                                                {currentPasswordVisible ? <EyeOff className="size-5"/> : <Eye className="size-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="settingsNewPasswordInput" className="form-label">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={newPasswordVisible ? "text" : "password"}
                                                id="settingsNewPasswordInput"
                                                className="ltr:pr-8 rtl:pl-8 form-input"
                                                autoComplete="new-password"
                                                placeholder="New password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                                                className="absolute inset-y-0 flex items-center text-gray-500 dark:text-dark-500 ltr:right-3 rtl:left-3 focus:outline-none"
                                            >
                                                {newPasswordVisible ? <EyeOff className="size-5"/> : <Eye className="size-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="settingsConfirmPasswordInput" className="form-label">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={confirmPasswordVisible ? "text" : "password"}
                                                id="settingsConfirmPasswordInput"
                                                className="ltr:pr-8 rtl:pl-8 form-input"
                                                autoComplete="new-password"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                                className="absolute inset-y-0 flex items-center text-gray-500 dark:text-dark-500 ltr:right-3 rtl:left-3 focus:outline-none"
                                            >
                                                {confirmPasswordVisible ? <EyeOff className="size-5"/> : <Eye className="size-5"/>}
                                            </button>
                                        </div>
                                        {confirmPassword && newPassword !== confirmPassword && (
                                            <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="submit"
                                            disabled={passwordSubmitting}
                                            className="btn btn-primary disabled:opacity-60"
                                        >
                                            {passwordSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="size-4 animate-spin"/>
                                                    Updating...
                                                </span>
                                            ) : (
                                                "Update Password"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Delete Account ───────────────────────────────── */}
            <div className="mt-5 card">
                <div className="card-body">
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 xl:col-span-3">
                            <h6 className="card-title">Delete Account</h6>
                        </div>
                        <div className="col-span-12 xl:col-span-9">
                            <div className="card-body">
                                <p className="mb-3 text-gray-500 dark:text-dark-500">
                                    Please proceed with caution, as deleting your account and all
                                    associated data from our organization is a permanent action
                                    and cannot be undone.
                                </p>
                                <div className="flex items-center justify-end gap-2">
                                    <button className="btn btn-red">Delete Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AccountSettings;
