import api from '@src/utils/axios_api';

export interface ContactFormData {
    name: string;
    email: string;
    topic: string;
    message: string;
}

export interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    topic: string;
    message: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
    createdAt: string;
    updatedAt: string;
}

export interface ContactStats {
    total: number;
    unread: number;
    replied: number;
    archived: number;
}

export const contactService = {
    // Public
    async send(data: ContactFormData) {
        const res = await api.post<{ message: string; id: string }>('/contact/send', data);
        return res.data;
    },

    // Admin
    async getStats(): Promise<ContactStats> {
        const res = await api.get<ContactStats>('/contact/stats');
        return res.data;
    },

    async list(params?: { status?: string; page?: number; limit?: number }) {
        const res = await api.get<{
            messages: ContactMessage[];
            total: number;
            page: number;
            pages: number;
        }>('/contact', { params });
        return res.data;
    },

    async getOne(id: string): Promise<ContactMessage> {
        const res = await api.get<ContactMessage>(`/contact/${id}`);
        return res.data;
    },

    async updateStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
        const res = await api.patch<ContactMessage>(`/contact/${id}/status`, { status });
        return res.data;
    },

    async reply(id: string, replyText: string): Promise<{ message: string; contact: ContactMessage }> {
        const res = await api.post(`/contact/${id}/reply`, { replyText });
        return res.data;
    },

    async remove(id: string) {
        const res = await api.delete<{ message: string }>(`/contact/${id}`);
        return res.data;
    },
};
