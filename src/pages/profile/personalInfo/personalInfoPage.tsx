import React, { useEffect, useState } from "react";
import type { UpdatePersonalInfoData, PersonalInfo } from "@dtos/personalInfo";
import { personalInfoService } from "../../../services/personalInfo.service";
import toast, { Toaster } from "react-hot-toast";
import { FolderOpen } from "lucide-react";

const PersonalInfoPage: React.FC = () => {
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
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
            }
        };
        void loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        try {
            await personalInfoService.update(form);
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            console.error("Update error:", err);
            toast.error(
                "Update failed: " + (err.response?.data?.message || err.message || "Something went wrong")
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4">
            <Toaster position="top-right" />

            <div className="bg-white shadow-xl rounded-3xl p-12 w-full max-w-3xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Personal Information
                </h2>


                <div className="flex justify-center mb-8">
                    {profilePreview ? (
                        <img
                            src={profilePreview}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-4 border-gray-200">
                            No Photo
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>

                        <input
                            type="file"
                            id="profilePic"
                            name="profilePic"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />

                        <label
                            htmlFor="profilePic"
                            className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 transition-all duration-200"
                        >
                            <FolderOpen className="w-6 h-6 text-amber-500" />
                            <span className="text-sm text-gray-700 font-medium">
                {form.profilePic instanceof File ? form.profilePic.name : "Choose File"}
              </span>
                        </label>
                    </div>

                    {[
                        { key: "name", label: "Full Name", type: "text" },
                        { key: "dob", label: "Date of Birth", type: "date" },
                        { key: "phone", label: "Phone Number", type: "tel" },
                        { key: "github", label: "GitHub URL", type: "text" },
                        { key: "linkedin", label: "LinkedIn URL", type: "text" },
                        { key: "bio", label: "Bio", type: "text" },
                    ].map(({ key, label, type }) => (
                        <div key={key}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                            <input
                                type={type}
                                name={key}
                                value={
                                    typeof form[key as keyof UpdatePersonalInfoData] === "string"
                                        ? (form[key as keyof UpdatePersonalInfoData] as string)
                                        : ""
                                }
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition duration-200 bg-white"
                            />
                        </div>
                    ))}


                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PersonalInfoPage;