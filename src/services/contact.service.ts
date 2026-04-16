import api from '@src/utils/axios_api';

export interface ContactFormData {
    name: string;
    email: string;
    topic: string;
    message: string;
}

export const contactService = {
    async send(data: ContactFormData) {
        const res = await api.post<{ message: string; id: string }>('/contact/send', data);
        return res.data;
    },
};
