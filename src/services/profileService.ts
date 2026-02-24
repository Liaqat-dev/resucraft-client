import api from "@src/utils/axios_api";
import {Education, PersonalInfo} from "@dtos/index.ts";
import {CreateEducationData} from "@src/services/education.service.ts";


export const profileService = {

        //personal Information
        async getPersonalInfo(): Promise<PersonalInfo> {
            const res = await api.get("/personal-info");
            return res.data.personalInfo;
        },
        async setPersonalInfo(data: PersonalInfo): Promise<any> {
            const res = await api.put("/personal-info", data);
            console.log(res);
            res.data.personalInfo;
        },

        // Education
        async getEducation(): Promise<Education> {
            try {
                const response = await api.get("/education");
                return response.data;
            } catch (error) {
                console.error(" [EducationService] GET /education error:", error);
                throw error;
            }
        },
        async addEducation(data: CreateEducationData): Promise<Education> {
            try {
                const response = await api.post("/education", data);
                return response.data;
            } catch (error: any) {
                console.error(" [EducationService] POST /education error:", error.response?.data || error);
                throw error;
            }
        },

        async updateEducation(id: string, data: Partial<CreateEducationData>): Promise<Education> {
            try {
                const response = await api.put(`/education/${id}`, data);
                return response.data;
            } catch (error: any) {
                console.error(`[EducationService] PUT /education/${id} error:`, error.response?.data || error);
                throw error;
            }
        },

        async deleteEducation(id: string): Promise<any> {
            try {
                const response = await api.delete(`/education/${id}`);
                return response.data;
            } catch (error: any) {
                console.error(`[EducationService] DELETE /education/${id} error:`, error.response?.data || error);
                throw error;
            }
        },
    }
;