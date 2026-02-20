import api from "@src/utils/axios_api";

export interface Education {
    _id: string;
    user: string;
    school: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    description?: string;
}

export interface CreateEducationData {
    school: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    description?: string;
}

export const educationService = {

    getAll: async () => {
        console.log("[EducationService] GET /education called");
        try {
            const response = await api.get("/education");
            console.log(" [EducationService] GET /education response:", response.data);
            return response.data;
        } catch (error) {
            console.error(" [EducationService] GET /education error:", error);
            throw error;
        }
    },


    create: async (data: CreateEducationData) => {
        console.log(" [EducationService] POST /education payload:", data);
        try {
            const response = await api.post("/education", data);
            console.log(" [EducationService] POST /education response:", response.data);
            return response.data;
        } catch (error: any) {
            console.error(" [EducationService] POST /education error:", error.response?.data || error);
            throw error;
        }
    },


    update: async (id: string, data: Partial<CreateEducationData>) => {
        console.log(`[EducationService] PUT /education/${id} payload:`, data);
        try {
            const response = await api.put(`/education/${id}`, data);
            console.log(` [EducationService] PUT /education/${id} response:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error(`[EducationService] PUT /education/${id} error:`, error.response?.data || error);
            throw error;
        }
    },


    delete: async (id: string) => {
        console.log(` [EducationService] DELETE /education/${id} called`);
        try {
            const response = await api.delete(`/education/${id}`);
            console.log(` [EducationService] DELETE /education/${id} response:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error(`[EducationService] DELETE /education/${id} error:`, error.response?.data || error);
            throw error;
        }
    },
};
