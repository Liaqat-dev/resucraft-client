import axiosInstance from "@src/utils/axios_api";
import { PersonalInfo, UpdatePersonalInfoData } from "@dtos/personalInfo";

const BASE_URL = "/personal-info";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const attachProfileURL = (data: PersonalInfo): PersonalInfo => {
    if (data.profilePic && !data.profilePic.startsWith("http")) {
        data.profilePic = `${API_BASE}/uploads/profilePics/${data.profilePic}`;
    }
    return data;
};

export const personalInfoService = {
    async get(): Promise<PersonalInfo> {
        const res = await axiosInstance.get(BASE_URL);
        return attachProfileURL(res.data.personalInfo);
    },

    async update(form: UpdatePersonalInfoData): Promise<PersonalInfo> {
        const formData = new FormData();

        Object.keys(form).forEach((key) => {
            const value = form[key as keyof UpdatePersonalInfoData];

            if (value !== null && value !== undefined) {
                if (typeof value === "number") {
                    formData.append(key, value.toString());
                } else {
                    formData.append(key, value as string | Blob);
                }
            }
        });

        const res = await axiosInstance.put(BASE_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return attachProfileURL(res.data.personalInfo);
    },
};