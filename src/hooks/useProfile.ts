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
    fetchEducation,
    deleteEducation,
    fetchExperience,
    deleteExperience,
    fetchSkills,
    createSkills,
    deleteSkill,
} from '@src/slices/profile/thunk.ts';
import { CreateCertificateData, CreateProjectData, PersonalInfo } from '@dtos/index.ts';

export function useProfile() {
    const dispatch = useAppDispatch();
    const {
        personalInfo,
        personalInfoLoaded,
        projects,
        certificates,
        education,
        experience,
        skills,
        loading,
        projectsLoading,
        certificatesLoading,
        educationLoading,
        experienceLoading,
        skillsLoading,
        error,
    } = useAppSelector((state) => state.profile);

    return {
        // State
        personalInfo,
        personalInfoLoaded,
        projects,
        certificates,
        education,
        experience,
        skills,
        loading,
        projectsLoading,
        certificatesLoading,
        educationLoading,
        experienceLoading,
        skillsLoading,
        error,

        // Personal Info
        fetchPersonalInfo: (force?: boolean) => dispatch(fetchPersonalInfo(force)),
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

        // Education
        fetchEducation: (force?: boolean) => dispatch(fetchEducation(force)),
        deleteEducation: (id: string) => dispatch(deleteEducation(id)),

        // Experience
        fetchExperience: (force?: boolean) => dispatch(fetchExperience(force)),
        deleteExperience: (id: string) => dispatch(deleteExperience(id)),

        // Skills
        fetchSkills: (force?: boolean) => dispatch(fetchSkills(force)),
        createSkills: (skills: { name: string; category: string }[]) => dispatch(createSkills(skills)),
        deleteSkill: (id: string) => dispatch(deleteSkill(id)),
    };
}