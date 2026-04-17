import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Certificate, Education, Experience, PersonalInfo, ProfileState, Project, Skill } from '@dtos/index.ts';

const initialState: ProfileState = {
    personalInfo: {},
    projects: [],
    certificates: [],
    education: [],
    experience: [],
    skills: [],
    loading: false,
    fullProfileLoading: false,
    fullProfileLoaded: false,
    personalInfoLoaded: false,
    projectsLoading: false,
    certificatesLoading: false,
    educationLoading: false,
    experienceLoading: false,
    skillsLoading: false,
    projectsLoaded: false,
    certificatesLoaded: false,
    educationLoaded: false,
    experienceLoaded: false,
    skillsLoaded: false,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setFullProfileLoading: (state, action: PayloadAction<boolean>) => {
            state.fullProfileLoading = action.payload;
        },

        setFullProfileLoaded: (state, action: PayloadAction<boolean>) => {
            state.fullProfileLoaded = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        setPersonalInfo: (state, action: PayloadAction<PersonalInfo>) => {
            state.personalInfo = action.payload;
            state.loading = false;
            state.personalInfoLoaded = true;
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
            state.projectsLoaded = true;
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
            state.certificatesLoaded = true;
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

        // Education
        setEducationLoading: (state, action: PayloadAction<boolean>) => {
            state.educationLoading = action.payload;
        },

        setEducation: (state, action: PayloadAction<Education[]>) => {
            state.education = action.payload;
            state.educationLoading = false;
            state.educationLoaded = true;
        },

        addEducation: (state, action: PayloadAction<Education>) => {
            state.education.unshift(action.payload);
        },

        updateEducation: (state, action: PayloadAction<Education>) => {
            const idx = state.education.findIndex((e) => e._id === action.payload._id);
            if (idx !== -1) state.education[idx] = action.payload;
        },

        removeEducation: (state, action: PayloadAction<string>) => {
            state.education = state.education.filter((e) => e._id !== action.payload);
        },

        // Experience
        setExperienceLoading: (state, action: PayloadAction<boolean>) => {
            state.experienceLoading = action.payload;
        },

        setExperience: (state, action: PayloadAction<Experience[]>) => {
            state.experience = action.payload;
            state.experienceLoading = false;
            state.experienceLoaded = true;
        },

        addExperience: (state, action: PayloadAction<Experience>) => {
            state.experience.unshift(action.payload);
        },

        updateExperience: (state, action: PayloadAction<Experience>) => {
            const idx = state.experience.findIndex((e) => e._id === action.payload._id);
            if (idx !== -1) state.experience[idx] = action.payload;
        },

        removeExperience: (state, action: PayloadAction<string>) => {
            state.experience = state.experience.filter((e) => e._id !== action.payload);
        },

        // Skills
        setSkillsLoading: (state, action: PayloadAction<boolean>) => {
            state.skillsLoading = action.payload;
        },

        setSkills: (state, action: PayloadAction<Skill[]>) => {
            state.skills = action.payload;
            state.skillsLoading = false;
            state.skillsLoaded = true;
        },

        removeSkill: (state, action: PayloadAction<string>) => {
            state.skills = state.skills.filter((s) => s._id !== action.payload);
        },

        clearProfile: (state) => {
            state.personalInfo = {};
            state.projects = [];
            state.certificates = [];
            state.education = [];
            state.experience = [];
            state.skills = [];
            state.loading = false;
            state.fullProfileLoading = false;
            state.fullProfileLoaded = false;
            state.personalInfoLoaded = false;
            state.projectsLoading = false;
            state.certificatesLoading = false;
            state.educationLoading = false;
            state.experienceLoading = false;
            state.skillsLoading = false;
            state.projectsLoaded = false;
            state.certificatesLoaded = false;
            state.educationLoaded = false;
            state.experienceLoaded = false;
            state.skillsLoaded = false;
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setFullProfileLoading,
    setFullProfileLoaded,
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
    setEducationLoading,
    setEducation,
    addEducation,
    updateEducation,
    removeEducation,
    setExperienceLoading,
    setExperience,
    addExperience,
    updateExperience,
    removeExperience,
    setSkillsLoading,
    setSkills,
    removeSkill,
    clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;