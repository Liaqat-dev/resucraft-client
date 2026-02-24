import api from "@src/utils/axios_api";
import { Certificate, CreateCertificateData } from "@dtos/userProfile.ts";

const BASE = "/certificates";

export const certificatesService = {
    async getAll() {
        const res = await api.get<{ status: string; certificates: Certificate[] }>(BASE);
        return res.data;
    },

    async create(data: CreateCertificateData) {
        const res = await api.post<{ status: string; certificate: Certificate }>(BASE, data);
        return res.data;
    },

    async update(id: string, data: Partial<CreateCertificateData>) {
        const res = await api.put<{ status: string; certificate: Certificate }>(`${BASE}/${id}`, data);
        return res.data;
    },

    async delete(id: string) {
        const res = await api.delete<{ status: string }>(`${BASE}/${id}`);
        return res.data;
    },
};