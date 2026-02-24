import axiosInstance from "@src/utils/axios_api";
import { Experience, CreateExperienceData } from "@dtos/userProfile.ts";

const BASE_URL = "/experience";

export const experienceService = {
    async getExperiences() {
        const res = await axiosInstance.get(BASE_URL);
        return res.data as { status: string; experiences: Experience[] };
    },

    async createExperience(data: CreateExperienceData) {
        const res = await axiosInstance.post(BASE_URL, data);
        return res.data as { status: string; experience: Experience };
    },

    async updateExperience(id: string, data: CreateExperienceData) {
        const res = await axiosInstance.put(`${BASE_URL}/${id}`, data);
        return res.data as { status: string; experience: Experience };
    },

    async deleteExperience(id: string) {
        const res = await axiosInstance.delete(`${BASE_URL}/${id}`);
        return res.data as { status: string };
    },
};
