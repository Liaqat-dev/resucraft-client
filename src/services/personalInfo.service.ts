import axiosInstance from "@src/utils/axios_api";
import { PersonalInfo, UpdatePersonalInfoData } from "@dtos/personalInfo";

const BASE_URL = "/personal-info";

// imgbb always returns a full https:// URL, so no transformation is needed.
const normaliseProfilePic = (data: PersonalInfo): PersonalInfo => data;

export const personalInfoService = {
    async get(): Promise<PersonalInfo> {
        const res = await axiosInstance.get(BASE_URL);
        return normaliseProfilePic(res.data.personalInfo);
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

        return normaliseProfilePic(res.data.personalInfo);
    },
};