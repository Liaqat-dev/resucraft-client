import api from "@src/utils/axios_api";

export interface Skill {
    _id: string;
    name: string;
    category: "Technical" | "Soft" | "Other";
}

export const skillService = {
    getAll: async () => {
        const res = await api.get("/skills");
        return res.data;
    },

    createBulk: async (skills: { name: string; category: string }[]) => {
        const res = await api.post("/skills", { skills });
        return res.data;
    },

    delete: async (id: string) => {
        const res = await api.delete(`/skills/${id}`);
        return res.data;
    },
};