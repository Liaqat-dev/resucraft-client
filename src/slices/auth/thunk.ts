
import {createAsyncThunk} from '@reduxjs/toolkit';
import {authService} from '../../services/authService';
import {login, logout, setRefreshAccessToken, setUser} from '@src/slices/auth/reducer.ts';
import {ChangePasswordData, LoginData, RegisterData, ResetPasswordData, VerifyEmailData} from '@dtos/auth.ts';


export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // Try to refresh token on app load
            const response = await authService.refreshToken();

            // Set access token
            dispatch(setRefreshAccessToken({
                accessToken: response.accessToken
            }));

            // Fetch user profilePics
            const user = await authService.getProfile();
            dispatch(setUser({ user }));

            return { user, accessToken: response.accessToken };
        } catch (error: any) {
            // If refresh fails, user needs to login
            console.log('Auto-refresh failed, user needs to login');
            return rejectWithValue({
                message: 'Session expired'
            });
        }
    }
);
// Register User
export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);
            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Registration failed',
                errors: error.response?.data?.errors
            });
        }
    }
);

// Login User
export const loginUser = createAsyncThunk(
    'auth/login',
    async (data: LoginData, { dispatch, rejectWithValue }) => {
        try {
            const response = await authService.login(data);

            // Check if needs verification
            if (response.needsVerification) {
                return { needsVerification: true, email: response.email };
            }

            // Check if needs 2FA
            if (response.needs2FA) {
                return { needs2FA: true };
            }

            // Successful login
            dispatch(login({
                accessToken: response.accessToken,
                user: {
                    _id: response._id,
                    name: response.name,
                    username: response.username,
                    email: response.email,
                    isVerified: response.isVerified,
                    provider: response.provider as 'local' | 'google',
                    twoFactorEnabled: response.twoFactorEnabled
                }
            }));

            return { success: true, user: response };
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Login failed',
                errors: error.response?.data?.errors
            });
        }
    }
);

// Google Login
export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (accessToken: string, {dispatch, rejectWithValue}) => {
        try {
            const response = await authService.googleLogin(accessToken);

            dispatch(login({
                user: {
                    _id: response._id,
                    name: response.name,
                    username: response.username,
                    email: response.email,
                    isVerified: response.isVerified,
                    provider: 'google',
                    twoFactorEnabled: response.twoFactorEnabled
                }
            }));

            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Google login failed'
            });
        }
    }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (data: VerifyEmailData, {rejectWithValue}) => {
        try {
            const response = await authService.verifyEmail(data);
            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Verification failed'
            });
        }
    }
);

// Resend Verification Code
export const resendCode = createAsyncThunk(
    'auth/resendCode',
    async (email: string, {rejectWithValue}) => {
        try {
            const response = await authService.resendCode(email);
            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to resend code'
            });
        }
    }
);

// Get User Profile
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, {dispatch, rejectWithValue}) => {
        try {
            const user = await authService.getProfile();
            dispatch(setUser({user}));
            return user;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch profilePics'
            });
        }
    }
);

// Change Password
export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (data: ChangePasswordData, {rejectWithValue}) => {
        try {
            const response = await authService.changePassword(data);
            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to change password',
                errors: error.response?.data?.errors
            });
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, {rejectWithValue}) => {
        try {
            const response = await authService.forgotPassword(email);
            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to send reset email'
            });
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data: ResetPasswordData, {rejectWithValue}) => {
        try {
            const response = await authService.resetPassword(data);
            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to reset password',
                errors: error.response?.data?.errors
            });
        }
    }
);

// Refresh Token
export const refreshAccessToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, {dispatch, rejectWithValue}) => {
        try {
            const response = await authService.refreshToken();
            dispatch(setRefreshAccessToken({accessToken: response.accessToken}));
            return response;
        } catch (error: any) {
            console.error('Token refresh failed:', error);
            return rejectWithValue({
                message: 'Session expired, please login again'
            });
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, {dispatch}) => {
        try {
            await authService.logout();
            dispatch(logout());
        } catch (error) {
            // Still logout locally even if API call fails
            dispatch(logout());
        }
    }
);

// Logout All Devices
export const logoutAllDevices = createAsyncThunk(
    'auth/logoutAll',
    async (_, {dispatch}) => {
        try {
            const response = await authService.logoutAll();
            dispatch(logout());
            return response;
        } catch (error: any) {
            dispatch(logout());
            throw error;
        }
    }
);