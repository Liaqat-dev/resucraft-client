import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '@src/services/profileService.ts';
import { projectsService } from '@src/services/projects.service.ts';
import { certificatesService } from '@src/services/certificates.service.ts';
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
} from '@src/slices/profile/reducer.ts';
import { Certificate, CreateCertificateData, CreateProjectData, PersonalInfo, Project } from '@dtos/index.ts';

// ── Personal Info ─────────────────────────────────────────────────────────────

export const fetchPersonalInfo = createAsyncThunk(
    'profile/fetchPersonalInfo',
    async (_, { dispatch, rejectWithValue }) => {
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
    async (_, { dispatch, rejectWithValue }) => {
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
    async (_, { dispatch, rejectWithValue }) => {
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