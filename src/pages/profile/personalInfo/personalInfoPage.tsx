import React, { useEffect, useState } from "react";
import type { UpdatePersonalInfoData, PersonalInfo } from "@dtos/personalInfo";
import { personalInfoService } from "@src/services/personalInfo.service.ts";
import toast, { Toaster } from "react-hot-toast";
import { FolderOpen, Loader2, User } from "lucide-react";

// ── Skeleton shown while initial data is being fetched ──────────────────────
const Skeleton: React.FC = () => (
    <div className="min-h-screen flex justify-center items-start py-12 px-4">
        <div className=" shadow-xl rounded-3xl p-12 w-full max-w-3xl border border-gray-100">
            <div className="h-9 w-64 bg-gray-200 rounded-xl mx-auto mb-8 animate-pulse" />
            <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
            </div>
            <div className="space-y-6">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}>
                        <div className="h-4 w-28 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
                    </div>
                ))}
                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
        </div>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────

const PersonalInfoPage: React.FC = () => {
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<UpdatePersonalInfoData>({
        name: "",
        dob: "",
        bio: "",
        phone: "",
        github: "",
        linkedin: "",
        profilePic: null,
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const data: PersonalInfo = await personalInfoService.get();
                const dobFormatted = data.dob ? data.dob.split("T")[0] : "";
                setForm({
                    name: data.name || "",
                    dob: dobFormatted,
                    bio: data.bio || "",
                    phone: data.phone || "",
                    github: data.github || "",
                    linkedin: data.linkedin || "",
                    profilePic: null,
                });
                setProfilePreview(data.profilePic || null);
            } catch (err) {
                console.error("Error loading personal info:", err);
                toast.error("Failed to load profile data.");
            } finally {
                setIsLoading(false);
            }
        };
        void loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSubmitting) return;
        const { name, value, files } = e.target;
        if (files && files[0]) {
            setForm((prev) => ({ ...prev, [name]: files[0] }));
            setProfilePreview(URL.createObjectURL(files[0]));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const toastId = toast.loading(
            form.profilePic instanceof File
                ? "Uploading image & saving changes..."
                : "Saving changes..."
        );

        try {
            await personalInfoService.update(form);
            // Clear the pending file from form state after successful save
            setForm((prev) => ({ ...prev, profilePic: null }));
            toast.success("Profile updated successfully!", { id: toastId });
        } catch (err: any) {
            console.error("Update error:", err);
            toast.error(
                "Update failed: " +
                    (err.response?.data?.message || err.message || "Something went wrong"),
                { id: toastId }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Skeleton />;

    const uploadingImage = isSubmitting && form.profilePic instanceof File;

    return (
        <div className="min-h-screen  flex justify-center items-start py-12 px-4">
            <Toaster position="top-right" />

            <div className=" shadow-xl rounded-3xl p-12 w-full max-w-3xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Personal Information
                </h2>

                {/* ── Avatar preview ─────────────────────────────────────── */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        {profilePreview ? (
                            <img
                                src={profilePreview}
                                alt="Profile"
                                className={`w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md transition-opacity duration-200 ${
                                    isSubmitting ? "opacity-50" : ""
                                }`}
                            />
                        ) : (
                            <div
                                className={`w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200 transition-opacity duration-200 ${
                                    isSubmitting ? "opacity-50" : ""
                                }`}
                            >
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                        )}

                        {/* Spinner overlay on avatar while the image is uploading */}
                        {uploadingImage && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ── File picker ──────────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Profile Picture
                        </label>

                        <input
                            type="file"
                            id="profilePic"
                            name="profilePic"
                            accept="image/*"
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="hidden"
                        />

                        <label
                            htmlFor="profilePic"
                            className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm transition-all duration-200 ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:shadow-md hover:bg-gray-50"
                            }`}
                        >
                            <FolderOpen className="w-6 h-6 text-amber-500" />
                            <span className="text-sm text-gray-700 font-medium">
                                {form.profilePic instanceof File
                                    ? form.profilePic.name
                                    : "Choose File"}
                            </span>
                        </label>
                    </div>

                    {/* ── Text fields ──────────────────────────────────────── */}
                    {[
                        { key: "name", label: "Full Name", type: "text" },
                        { key: "dob", label: "Date of Birth", type: "date" },
                        { key: "phone", label: "Phone Number", type: "tel" },
                        { key: "github", label: "GitHub URL", type: "text" },
                        { key: "linkedin", label: "LinkedIn URL", type: "text" },
                        { key: "bio", label: "Bio", type: "text" },
                    ].map(({ key, label, type }) => (
                        <div key={key}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {label}
                            </label>
                            <input
                                type={type}
                                name={key}
                                value={
                                    typeof form[key as keyof UpdatePersonalInfoData] === "string"
                                        ? (form[key as keyof UpdatePersonalInfoData] as string)
                                        : ""
                                }
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition duration-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    ))}

                    {/* ── Submit button ─────────────────────────────────────── */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>
                                    {form.profilePic instanceof File
                                        ? "Uploading..."
                                        : "Saving..."}
                                </span>
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PersonalInfoPage;
