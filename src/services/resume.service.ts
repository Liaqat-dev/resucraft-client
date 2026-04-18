import api from '@src/utils/axios_api';

const normalize = (resume: any) => ({
    id: resume._id ?? resume.id,
    name: resume.name,
    category: resume.category,
    data: resume.data,
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
});

export const resumeService = {
    list: () =>
        api.get('/resumes').then(r => r.data.resumes),

    get: (id: string) =>
        api.get(`/resumes/${id}`).then(r => normalize(r.data.resume)),

    save: (data: object) =>
        api.post('/resumes', data).then(r => ({ id: r.data.resume._id ?? r.data.resume.id })),

    update: (id: string, data: object) =>
        api.put(`/resumes/${id}`, data).then(r => r.data),

    remove: (id: string) =>
        api.delete(`/resumes/${id}`).then(r => r.data),
};