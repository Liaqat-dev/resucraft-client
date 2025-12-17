import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import store from "../slices/store.ts";
import { logout, setRefreshAccessToken } from '@src/slices/auth/reducer.ts';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

// Create Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,  // ✅ CRITICAL: This sends cookies!
    headers: {
        'Content-Type': 'application/json'
    }
});

// ============================================
// Token Refresh Queue Management
// ============================================
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else if (token) {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

// ============================================
// Request Interceptor
// ============================================
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const token = state.auth?.accessToken;

        console.log(`🔵 ${config.method?.toUpperCase()} ${config.url}`);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// ============================================
// Response Interceptor with Token Refresh
// ============================================
api.interceptors.response.use(
    (response) => {
        // Update last activity timestamp
        localStorage.setItem('lastActiveVince', Date.now().toString());
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle non-401 errors immediately
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // Skip refresh for auth endpoints to prevent infinite loops
        const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                              originalRequest.url?.includes('/auth/signup') ||
                              originalRequest.url?.includes('/auth/refresh');
        
        if (isAuthEndpoint) {
            return Promise.reject(error);
        }

        // If 401 and we haven't tried to refresh yet
        if (!originalRequest._retry) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                console.log('🟡 Token refresh in progress, queueing request...');
                return new Promise((resolve, reject) => {
                    failedQueue.push({ 
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        }, 
                        reject 
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('🔄 Access token expired, refreshing...');

                // Call refresh endpoint (refresh token is in HttpOnly cookie)
                const response = await axios.post(
                    `${BASE_URL}/auth/refresh`,
                    {},  // Empty body - refresh token comes from cookie
                    { withCredentials: true }  // Must send cookies
                );

                const { accessToken: newAccessToken } = response.data;

                console.log('✅ Token refreshed successfully');

                // Store new access token in Redux
                store.dispatch(
                    setRefreshAccessToken({ accessToken: newAccessToken })
                );

                // Update the failed request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Process all queued requests with new token
                processQueue(null, newAccessToken);

                // Retry the original request
                return api(originalRequest);

            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);

                // Process queue with error
                processQueue(refreshError, null);

                // Clear auth state and redirect to login
                store.dispatch(logout());
                
                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/auth/sign-in')) {
                    window.location.href = '/auth/sign-in';
                }

                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        // If retry already attempted, reject
        return Promise.reject(error);
    }
);

// ============================================
// Helper Functions
// ============================================

/**
 * Check if user session is still valid
 */
export const checkSession = async (): Promise<boolean> => {
    try {
        const state = store.getState();
        const token = state.auth?.accessToken;

        if (!token) {
            // Try to refresh if no access token
            const response = await axios.post(
                `${BASE_URL}/auth/refresh`,
                {},
                { withCredentials: true }
            );

            store.dispatch(
                setRefreshAccessToken({ accessToken: response.data.accessToken })
            );

            return true;
        }

        return true;
    } catch (error) {
        console.log('No valid session found');
        return false;
    }
};

/**
 * Manually trigger token refresh
 */
export const refreshToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true }
        );

        const { accessToken } = response.data;

        store.dispatch(
            setRefreshAccessToken({ accessToken })
        );

        return accessToken;
    } catch (error) {
        console.error('Manual token refresh failed:', error);
        return null;
    }
};

/**
 * Clear all tokens and logout
 */
export const clearAuth = () => {
    store.dispatch(logout());
    localStorage.removeItem('lastActiveVince');
};

export default api;
// import axios from "axios";
// import store from "../slices/store.ts";
// import {logout, setRefreshAccessToken} from '@src/slices/auth/reducer.ts';

// const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

// // Create Axios instance
// const api = axios.create({
//     baseURL: BASE_URL,
//     withCredentials: true,  // ✅ CRITICAL: This sends cookies!
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// // Request interceptor to add token
// api.interceptors.request.use(
//     (config) => {
//         const state = store.getState();
//         const token = state.auth?.accessToken;

//         console.log(`${config.method?.toUpperCase()} ${config.url}`);

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Response interceptor to handle token refresh
// api.interceptors.response.use(
//     (response) => {
//         localStorage.setItem('lastActiveVince', Date.now().toString());
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         // If 401 and we haven't tried to refresh yet
//         if (
//             error.response &&
//             error.response.status === 401 &&
//             !originalRequest._retry
//         ) {
//             originalRequest._retry = true;

//             try {
//                 // ✅ FIX: Don't send body, refresh token is in cookie
//                 const res = await axios.post(
//                     `${BASE_URL}/auth/refresh`,
//                     {},  // ✅ Empty body - token comes from cookie
//                     {withCredentials: true}  // ✅ MUST have this to send/receive cookies
//                 );

//                 // ✅ NEW: Backend now returns new refresh token in cookie automatically
//                 // We just need to store the new access token
//                 store.dispatch(
//                     setRefreshAccessToken({accessToken: res.data.accessToken})
//                 );

//                 // Retry original request with new token
//                 originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 console.error('Token refresh failed:', refreshError);
//                 store.dispatch(logout());
//                 window.location.href = '/auth/sign-in';
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;