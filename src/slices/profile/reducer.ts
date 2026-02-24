import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PersonalInfo, ProfileState } from '@dtos/index.ts';

const initialState: ProfileState = {
    personalInfo: {},
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        setPersonalInfo: (state, action: PayloadAction<PersonalInfo>) => {
            state.personalInfo = action.payload;
            state.loading = false;
            state.error = null;
        },

        updatePersonalInfo: (state, action: PayloadAction<PersonalInfo>) => {
            state.personalInfo = { ...state.personalInfo, ...action.payload };
            state.loading = false;
        },

        clearProfile: (state) => {
            state.personalInfo = {};
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setError,
    setPersonalInfo,
    updatePersonalInfo,
    clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;