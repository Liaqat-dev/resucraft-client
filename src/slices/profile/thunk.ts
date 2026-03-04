import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '@src/services/profileService.ts';
import { projectsService } from '@src/services/projects.service.ts';
import { certificatesService } from '@src/services/certificates.service.ts';
import { educationService } from '@src/services/education.service.ts';
import { experienceService } from '@src/services/experience.service.ts';
import { skillService } from '@src/services/skills.service.ts';
import { RootState } from '@src/slices/store.ts';
import {
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
    removeEducation,
    setExperienceLoading,
    setExperience,
    removeExperience,
    setSkillsLoading,
    setSkills,
    removeSkill,
} from '@src/slices/profile/reducer.ts';
import { Certificate, CreateCertificateData, CreateProjectData, Education, Experience, PersonalInfo, Project } from '@dtos/index.ts';

// ── Personal Info ─────────────────────────────────────────────────────────────

export const fetchPersonalInfo = createAsyncThunk(
    'profile/fetchPersonalInfo',
    async (force?: boolean, { dispatch, getState, rejectWithValue }: any = {}) => {
        const state = (getState() as RootState).profile;
        if (!force && state.personalInfoLoaded) return state.personalInfo;
        try {
            const data = await profileService.getPersonalInfo();
            dispatch(setPersonalInfo(data));
            return data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch personal info',
            });
        }
    }
);

export const savePersonalInfo = createAsyncThunk(
    'profile/savePersonalInfo',
    async (data: PersonalInfo, { dispatch, rejectWithValue }) => {
        try {
            await profileService.setPersonalInfo(data);
            dispatch(updatePersonalInfo(data));
            return data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to save personal info',
            });
        }
    }
);

// ── Projects ──────────────────────────────────────────────────────────────────

export const fetchProjects = createAsyncThunk(
    'profile/fetchProjects',
    async (force?: boolean, { dispatch, getState, rejectWithValue }: any = {}) => {
        const state = (getState() as RootState).profile;
        if (!force && state.projectsLoaded) return null;
        dispatch(setProjectsLoading(true));
        try {
            const res = await projectsService.getAll();
            dispatch(setProjects(res.projects));
            return res.projects;
        } catch (error: any) {
            dispatch(setProjectsLoading(false));
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch projects',
            });
        }
    }
);

export const createProject = createAsyncThunk(
    'profile/createProject',
    async (data: CreateProjectData, { dispatch, rejectWithValue }) => {
        try {
            const res = await projectsService.create(data);
            dispatch(addProject(res.project));
            return res.project;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to create project',
            });
        }
    }
);

export const editProject = createAsyncThunk(
    'profile/editProject',
    async ({ id, data }: { id: string; data: Partial<CreateProjectData> }, { dispatch, rejectWithValue }) => {
        try {
            const res = await projectsService.update(id, data);
            dispatch(updateProject(res.project));
            return res.project;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to update project',
            });
        }
    }
);

export const deleteProject = createAsyncThunk(
    'profile/deleteProject',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await projectsService.delete(id);
            dispatch(removeProject(id));
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to delete project',
            });
        }
    }
);

// ── Certificates ──────────────────────────────────────────────────────────────

export const fetchCertificates = createAsyncThunk(
    'profile/fetchCertificates',
    async (force?: boolean, { dispatch, getState, rejectWithValue }: any = {}) => {
        const state = (getState() as RootState).profile;
        if (!force && state.certificatesLoaded) return null;
        dispatch(setCertificatesLoading(true));
        try {
            const res = await certificatesService.getAll();
            dispatch(setCertificates(res.certificates));
            return res.certificates;
        } catch (error: any) {
            dispatch(setCertificatesLoading(false));
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch certificates',
            });
        }
    }
);

export const createCertificate = createAsyncThunk(
    'profile/createCertificate',
    async (data: CreateCertificateData, { dispatch, rejectWithValue }) => {
        try {
            const res = await certificatesService.create(data);
            dispatch(addCertificate(res.certificate));
            return res.certificate;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to create certificate',
            });
        }
    }
);

export const editCertificate = createAsyncThunk(
    'profile/editCertificate',
    async ({ id, data }: { id: string; data: Partial<CreateCertificateData> }, { dispatch, rejectWithValue }) => {
        try {
            const res = await certificatesService.update(id, data);
            dispatch(updateCertificate(res.certificate));
            return res.certificate;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to update certificate',
            });
        }
    }
);

export const deleteCertificate = createAsyncThunk(
    'profile/deleteCertificate',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await certificatesService.delete(id);
            dispatch(removeCertificate(id));
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to delete certificate',
            });
        }
    }
);

// ── Education ──────────────────────────────────────────────────────────────────

export const fetchEducation = createAsyncThunk(
    'profile/fetchEducation',
    async (force?: boolean, { dispatch, getState, rejectWithValue }: any = {}) => {
        const state = (getState() as RootState).profile;
        if (!force && state.educationLoaded) return null;
        dispatch(setEducationLoading(true));
        try {
            const res = await educationService.getAll();
            const educations: Education[] = res.educations || [];
            educations.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
            dispatch(setEducation(educations));
            return educations;
        } catch (error: any) {
            dispatch(setEducationLoading(false));
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch education',
            });
        }
    }
);

export const deleteEducation = createAsyncThunk(
    'profile/deleteEducation',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await educationService.delete(id);
            dispatch(removeEducation(id));
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to delete education',
            });
        }
    }
);

// ── Experience ────────────────────────────────────────────────────────────────

export const fetchExperience = createAsyncThunk(
    'profile/fetchExperience',
    async (force?: boolean, { dispatch, getState, rejectWithValue }: any = {}) => {
        const state = (getState() as RootState).profile;
        if (!force && state.experienceLoaded) return null;
        dispatch(setExperienceLoading(true));
        try {
            const res = await experienceService.getExperiences();
            dispatch(setExperience(res.experiences));
            return res.experiences;
        } catch (error: any) {
            dispatch(setExperienceLoading(false));
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch experience',
            });
        }
    }
);

export const deleteExperience = createAsyncThunk(
    'profile/deleteExperience',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await experienceService.deleteExperience(id);
            dispatch(removeExperience(id));
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to delete experience',
            });
        }
    }
);

// ── Skills ────────────────────────────────────────────────────────────────────

export const fetchSkills = createAsyncThunk(
    'profile/fetchSkills',
    async (force?: boolean, { dispatch, getState, rejectWithValue }: any = {}) => {
        const state = (getState() as RootState).profile;
        if (!force && state.skillsLoaded) return null;
        dispatch(setSkillsLoading(true));
        try {
            const res = await skillService.getAll();
            dispatch(setSkills(res.skills || []));
            return res.skills;
        } catch (error: any) {
            dispatch(setSkillsLoading(false));
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch skills',
            });
        }
    }
);

export const createSkills = createAsyncThunk(
    'profile/createSkills',
    async (skills: { name: string; category: string }[], { dispatch, rejectWithValue }) => {
        try {
            await skillService.createBulk(skills);
            dispatch(fetchSkills(true) as any);
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to create skills',
            });
        }
    }
);

export const deleteSkill = createAsyncThunk(
    'profile/deleteSkill',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await skillService.delete(id);
            dispatch(removeSkill(id));
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to delete skill',
            });
        }
    }
);