import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User,AuthState } from '@dtos/index.ts';


const initialState: AuthState = {
    accessToken: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        login: (
            state,
            action: PayloadAction<{ accessToken?: string; user: User }>
        ) => {
            if (action.payload.accessToken) {
                state.accessToken = action.payload.accessToken;
            }
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },

        setRefreshAccessToken: (
            state,
            action: PayloadAction<{ accessToken: string }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },

        setUser: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.loading = false;
        },

        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },

        logout: (state) => {
            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setError,
    login,
    logout,
    setUser,
    updateUser,
    setRefreshAccessToken,
} = authSlice.actions;

export default authSlice.reducer;