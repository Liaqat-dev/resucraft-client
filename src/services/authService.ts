import api from '@src/utils/axios_api';
import {
    ActivityLog,
    AuthStats,
    ChangePasswordData,
    LoginData,
    LoginResponse,
    RegisterData,
    ResetPasswordData,
    Session,
    updateAccountInfoData,
    User,
    VerifyEmailData
} from '@dtos/auth.ts';

export const authService = {
    // Register
    async register(data: RegisterData) {
        const response = await api.post<{
            message: string;
            needsVerification: boolean;
            email: string
        }>('/auth/signup', data);
        return response.data;
    },

    // Login
    async login(data: LoginData) {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    // Google Login
    async googleLogin(accessToken: string) {
        const response = await api.post<LoginResponse>('/auth/google', {accessToken});
        return response.data;
    },

    // Verify Email
    async verifyEmail(data: VerifyEmailData) {
        const response = await api.post<{
            message: string;
            isVerified: boolean
        }>('/auth/verify-email', data);
        return response.data;
    },

    // Resend Verification Code
    async resendCode(email: string) {
        const response = await api.post<{
            message: string;
            expiresIn: string
        }>('/auth/resend-code', {email});
        return response.data;
    },

    // Get Current User
    async getProfile() {
        const response = await api.get<User>('/auth/profile');
        return response.data;
    },

    // Change Password
    async changePassword(data: ChangePasswordData) {
        const response = await api.post<{
            message: string
        }>('/auth/change-password', data);
        return response.data;
    },

    // Forgot Password
    async forgotPassword(email: string) {
        const response = await api.post<{
            message: string
        }>('/auth/forgot-password', {email});
        return response.data;
    },

    // Reset Password
    async resetPassword(data: ResetPasswordData) {
        const {token, password, confirmPassword} = data;
        const response = await api.post<{
            message: string
        }>(`/auth/reset-password/${token}`, {
            password,
            confirmPassword
        });
        return response.data;
    },

    // ✅ FIX: Refresh Token - don't send body, cookie handles it
    async refreshToken() {
        const response = await api.post<{
            message: string;
            accessToken: string
        }>('/auth/refresh', {}, {withCredentials: true});  // ✅ Empty body
        return response.data;
    },

    // Logout
    async logout() {
        const response = await api.post<{
            message: string
        }>('/auth/logout');
        return response.data;
    },

    // Logout All Devices
    async logoutAll() {
        const response = await api.post<{
            message: string;
            sessionsEnded: number
        }>('/auth/logout-all');
        return response.data;
    },

    // Get All Sessions
    async getSessions() {
        const response = await api.get<{
            sessions: Session[];
            total: number;
            maxAllowed: number
        }>('/auth/sessions');
        return response.data;
    },

    // Revoke Session
    async revokeSession(sessionId: string) {
        const response = await api.delete<{
            message: string
        }>(`/auth/sessions/${sessionId}`);
        return response.data;
    },

    // Get Statistics
    async getStats() {
        const response = await api.get<AuthStats>('/auth/stats');
        return response.data;
    },

    // Get Activity Log
    async getActivity(limit: number = 50) {
        const response = await api.get<{
            activity: ActivityLog[];
            total: number
        }>(`/auth/activity?limit=${limit}`);
        return response.data;
    },
    async updateAccountInfo(data: updateAccountInfoData) {
        const formData = new FormData();
        if (data.username) formData.append('username', data.username);
        if (data.file) formData.append('profilePic', data.file);
        const response = await api.put('/auth/update-account-info', formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
        return response.data;
    }
};