import api from '@src/utils/axios_api';
import { UserRole } from '@dtos/auth';

export interface AdminUser {
    _id: string;
    username: string;
    email: string;
    role: UserRole;
    isSuspended: boolean;
    suspendedReason?: string | null;
    isVerified: boolean;
    provider: 'local' | 'google';
    profilePic?: { url?: string };
    lastLogin?: string | null;
    createdAt: string;
}

export interface AdminUsersResponse {
    users: AdminUser[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface AdminStats {
    total: number;
    roles: { user: number; moderator: number; admin: number };
    suspended: number;
    activeSessions: number;
}

export interface AdminTemplate {
    _id: string;
    name: string;
    category: string;
    visibility: 'public' | 'private';
    status: 'draft' | 'pending' | 'published';
    userId: { _id: string; username: string; email: string; profilePic?: { url?: string } } | string;
    data: any;
    createdAt: string;
    updatedAt: string;
}

export interface AdminTemplateStats {
    total: number;
    status: { draft: number; pending: number; published: number };
    visibility: { public: number; private: number };
}

export interface ListAdminTemplatesParams {
    page?: number;
    limit?: number;
    status?: string;
    visibility?: string;
    category?: string;
    search?: string;
}

export interface ListUsersParams {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    suspended?: boolean;
}

export const adminService = {
    async getStats(): Promise<AdminStats> {
        const res = await api.get<AdminStats>('/admin/stats');
        return res.data;
    },

    async listUsers(params: ListUsersParams = {}): Promise<AdminUsersResponse> {
        const query = new URLSearchParams();
        if (params.page)      query.set('page',      String(params.page));
        if (params.limit)     query.set('limit',     String(params.limit));
        if (params.role)      query.set('role',      params.role);
        if (params.search)    query.set('search',    params.search);
        if (params.suspended !== undefined) query.set('suspended', String(params.suspended));
        const res = await api.get<AdminUsersResponse>(`/admin/users?${query}`);
        return res.data;
    },

    async getUserById(id: string): Promise<{ user: AdminUser }> {
        const res = await api.get(`/admin/users/${id}`);
        return res.data;
    },

    async updateUserRole(id: string, role: UserRole): Promise<{ message: string; user: AdminUser }> {
        const res = await api.patch(`/admin/users/${id}/role`, { role });
        return res.data;
    },

    async suspendUser(id: string, reason?: string): Promise<{ message: string }> {
        const res = await api.patch(`/admin/users/${id}/suspend`, { reason });
        return res.data;
    },

    async unsuspendUser(id: string): Promise<{ message: string }> {
        const res = await api.patch(`/admin/users/${id}/unsuspend`);
        return res.data;
    },

    async deleteUser(id: string): Promise<{ message: string }> {
        const res = await api.delete(`/admin/users/${id}`);
        return res.data;
    },

    // ── Template management ───────────────────────────────────────────

    async getTemplateStats(): Promise<AdminTemplateStats> {
        const res = await api.get<AdminTemplateStats>('/admin/templates/stats');
        return res.data;
    },

    async listAdminTemplates(params: ListAdminTemplatesParams = {}): Promise<{ templates: AdminTemplate[]; pagination: { total: number; page: number; limit: number; pages: number } }> {
        const query = new URLSearchParams();
        if (params.page)       query.set('page',       String(params.page));
        if (params.limit)      query.set('limit',      String(params.limit));
        if (params.status)     query.set('status',     params.status);
        if (params.visibility) query.set('visibility', params.visibility);
        if (params.category)   query.set('category',   params.category);
        if (params.search)     query.set('search',     params.search);
        const res = await api.get(`/admin/templates?${query}`);
        return res.data;
    },

    async approveTemplate(id: string): Promise<{ message: string }> {
        const res = await api.patch(`/admin/templates/${id}/approve`);
        return res.data;
    },

    async rejectTemplate(id: string): Promise<{ message: string }> {
        const res = await api.patch(`/admin/templates/${id}/reject`);
        return res.data;
    },

    async deleteAdminTemplate(id: string): Promise<{ message: string }> {
        const res = await api.delete(`/admin/templates/${id}`);
        return res.data;
    },
};
