import api from '@src/utils/axios_api';

export const templateService = {
    list: () =>
        api.get('/templates').then(r => r.data),

    listAll: () =>
        api.get('/templates/all').then(r => r.data),

    get: (id: string) =>
        api.get(`/templates/${id}`).then(r => r.data),

    save: (data: object) =>
        api.post('/templates/save', data).then(r => r.data),

    update: (id: string, data: object) =>
        api.put(`/templates/${id}`, data).then(r => r.data),

    remove: (id: string) =>
        api.delete(`/templates/${id}`).then(r => r.data),
};