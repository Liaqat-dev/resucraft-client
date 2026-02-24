import { useAppDispatch, useAppSelector } from './useRedux';
import {
    fetchPersonalInfo,
    savePersonalInfo,
    fetchProjects,
    createProject,
    editProject,
    deleteProject,
    fetchCertificates,
    createCertificate,
    editCertificate,
    deleteCertificate,
} from '@src/slices/profile/thunk.ts';
import { CreateCertificateData, CreateProjectData, PersonalInfo } from '@dtos/index.ts';

export function useProfile() {
    const dispatch = useAppDispatch();
    const {
        personalInfo,
        projects,
        certificates,
        loading,
        projectsLoading,
        certificatesLoading,
        error,
    } = useAppSelector((state) => state.profile);

    return {
        // State
        personalInfo,
        projects,
        certificates,
        loading,
        projectsLoading,
        certificatesLoading,
        error,

        // Personal Info
        fetchPersonalInfo: () => dispatch(fetchPersonalInfo()),
        savePersonalInfo: (data: PersonalInfo) => dispatch(savePersonalInfo(data)),

        // Projects
        fetchProjects: () => dispatch(fetchProjects()),
        createProject: (data: CreateProjectData) => dispatch(createProject(data)),
        editProject: (id: string, data: Partial<CreateProjectData>) => dispatch(editProject({ id, data })),
        deleteProject: (id: string) => dispatch(deleteProject(id)),

        // Certificates
        fetchCertificates: () => dispatch(fetchCertificates()),
        createCertificate: (data: CreateCertificateData) => dispatch(createCertificate(data)),
        editCertificate: (id: string, data: Partial<CreateCertificateData>) => dispatch(editCertificate({ id, data })),
        deleteCertificate: (id: string) => dispatch(deleteCertificate(id)),
    };
}