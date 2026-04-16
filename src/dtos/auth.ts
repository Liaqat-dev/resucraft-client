// Auth Types
export type UserRole = 'user' | 'moderator' | 'admin';

export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    isVerified: boolean;
    provider: 'local' | 'google';
    role: UserRole;
    isSuspended?: boolean;
    twoFactorEnabled?: boolean;
    profilePic?: {
        url?: string;
        deleteUrl?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface Session {
    sessionId: string;
    deviceId: string;
    deviceName: string;
    browser: string;
    os: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    ipAddress: string;
    location?: {
        city: string;
        country: string;
    };
    lastActivity: string;
    createdAt: string;
    isCurrent: boolean;
}

export interface ActivityLog {
    action: string;
    success: boolean;
    ipAddress: string;
    userAgent: string;
    location?: {
        city: string;
        country: string;
    };
    timestamp: string;
    errorMessage?: string;
}

export interface AuthStats {
    sessions: {
        activeSessions: number;
        maxAllowed: number;
        totalSessions: number;
        lastActivity: string | null;
    };
    authentication: {
        logins: number;
        failedLogins: number;
        passwordChanges: number;
        period: string;
    };
    security: {
        suspiciousActivity: boolean;
        details?: {
            multipleFailedAttempts: boolean;
            multipleLocations: boolean;
        };
    };
}

export interface LoginResponse {
    _id: string;
    name: string;
    accessToken: string;
    username: string;
    email: string;
    isVerified: boolean;
    provider: string;
    role: UserRole;
    isSuspended?: boolean;
    twoFactorEnabled: boolean;
    needsVerification?: boolean;
    needs2FA?: boolean;
    message?: string;
}

export interface RegisterData {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    emailOrUsername: string;
    password: string;
}

export interface VerifyEmailData {
    email: string;
    code: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}
export interface updateAccountInfoData{
    username?: string;
    file:File|null;
}

export interface ResetPasswordData {
    token: string;
    password: string;
    confirmPassword: string;
}