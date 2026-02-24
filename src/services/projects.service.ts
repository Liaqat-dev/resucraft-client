import api from "@src/utils/axios_api";
import { Project, CreateProjectData } from "@dtos/userProfile.ts";

const BASE = "/projects";

export const projectsService = {
    async getAll() {
        const res = await api.get<{ status: string; projects: Project[] }>(BASE);
        return res.data;
    },

    async create(data: CreateProjectData) {
        const res = await api.post<{ status: string; project: Project }>(BASE, data);
        return res.data;
    },

    async update(id: string, data: Partial<CreateProjectData>) {
        const res = await api.put<{ status: string; project: Project }>(`${BASE}/${id}`, data);
        return res.data;
    },

    async delete(id: string) {
        const res = await api.delete<{ status: string }>(`${BASE}/${id}`);
        return res.data;
    },
};