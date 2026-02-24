import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Certificate, PersonalInfo, ProfileState, Project } from '@dtos/index.ts';

const initialState: ProfileState = {
    personalInfo: {},
    projects: [],
    certificates: [],
    loading: false,
    projectsLoading: false,
    certificatesLoading: false,
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

        // Projects
        setProjectsLoading: (state, action: PayloadAction<boolean>) => {
            state.projectsLoading = action.payload;
        },

        setProjects: (state, action: PayloadAction<Project[]>) => {
            state.projects = action.payload;
            state.projectsLoading = false;
        },

        addProject: (state, action: PayloadAction<Project>) => {
            state.projects.unshift(action.payload);
        },

        updateProject: (state, action: PayloadAction<Project>) => {
            const idx = state.projects.findIndex((p) => p._id === action.payload._id);
            if (idx !== -1) state.projects[idx] = action.payload;
        },

        removeProject: (state, action: PayloadAction<string>) => {
            state.projects = state.projects.filter((p) => p._id !== action.payload);
        },

        // Certificates
        setCertificatesLoading: (state, action: PayloadAction<boolean>) => {
            state.certificatesLoading = action.payload;
        },

        setCertificates: (state, action: PayloadAction<Certificate[]>) => {
            state.certificates = action.payload;
            state.certificatesLoading = false;
        },

        addCertificate: (state, action: PayloadAction<Certificate>) => {
            state.certificates.unshift(action.payload);
        },

        updateCertificate: (state, action: PayloadAction<Certificate>) => {
            const idx = state.certificates.findIndex((c) => c._id === action.payload._id);
            if (idx !== -1) state.certificates[idx] = action.payload;
        },

        removeCertificate: (state, action: PayloadAction<string>) => {
            state.certificates = state.certificates.filter((c) => c._id !== action.payload);
        },

        clearProfile: (state) => {
            state.personalInfo = {};
            state.projects = [];
            state.certificates = [];
            state.loading = false;
            state.projectsLoading = false;
            state.certificatesLoading = false;
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setError,
    setPersonalInfo,
    updatePersonalInfo,
    setProjectsLoading,
    setProjects,
    addProject,
    updateProject,
    removeProject,
    setCertificatesLoading,
    setCertificates,
    addCertificate,
    updateCertificate,
    removeCertificate,
    clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;