import { useMemo } from 'react';
import { useAppSelector } from './useRedux';

export interface CompletionSection {
    id: string;
    label: string;
    weight: number;   // max points this section gives
    earned: number;   // points earned (0 or weight)
    isComplete: boolean;
    isOptional: boolean;
    hint: string;     // what to do to complete it
    tabPath: string;  // /profile/<tab>
}

export interface ProfileCompletion {
    percentage: number;
    sections: CompletionSection[];
    completedCount: number;
    totalCount: number;
    /** Returns true if percentage >= threshold (default 70) */
    isProfileReady: (threshold?: number) => boolean;
}

export function useProfileCompletion(): ProfileCompletion {
    const user = useAppSelector((state) => state.auth.user);
    const { personalInfo, education, experience, skills, projects, certificates } =
        useAppSelector((state) => state.profile);

    const sections = useMemo<CompletionSection[]>(() => {
        // ── Profile Picture ─────────────────────────────────────────
        const hasPic = Boolean(user?.profilePic?.url);

        // ── Name + Profession ────────────────────────────────────────
        const hasIdentity = Boolean(
            personalInfo?.firstName &&
            personalInfo?.lastName &&
            personalInfo?.profession
        );

        // ── Contact ──────────────────────────────────────────────────
        const hasContact = Boolean(personalInfo?.phone && personalInfo?.address);

        // ── Bio ──────────────────────────────────────────────────────
        const hasBio = Boolean(
            personalInfo?.bio && String(personalInfo.bio).trim().length >= 20
        );

        // ── Education ────────────────────────────────────────────────
        const hasEducation = education.length >= 1;

        // ── Skills ───────────────────────────────────────────────────
        const hasSkills = skills.length >= 3;

        // ── Experience ───────────────────────────────────────────────
        const hasExperience = experience.length >= 1;

        // ── Socials (optional) ───────────────────────────────────────
        const hasSocials = Boolean(personalInfo?.github || personalInfo?.linkedin);

        // ── Projects (optional) ──────────────────────────────────────
        const hasProjects = projects.length >= 1;

        // ── Certificates (optional) ──────────────────────────────────
        const hasCertificates = certificates.length >= 1;

        return [
            {
                id: 'profilePic',
                label: 'Profile Picture',
                weight: 10,
                earned: hasPic ? 10 : 0,
                isComplete: hasPic,
                isOptional: false,
                hint: 'Upload a profile photo',
                tabPath: '/profile/overview',
            },
            {
                id: 'identity',
                label: 'Name & Profession',
                weight: 10,
                earned: hasIdentity ? 10 : 0,
                isComplete: hasIdentity,
                isOptional: false,
                hint: 'Add your first name, last name and profession',
                tabPath: '/profile/personal-info',
            },
            {
                id: 'contact',
                label: 'Contact Details',
                weight: 8,
                earned: hasContact ? 8 : 0,
                isComplete: hasContact,
                isOptional: false,
                hint: 'Add your phone number and address',
                tabPath: '/profile/personal-info',
            },
            {
                id: 'bio',
                label: 'Bio',
                weight: 7,
                earned: hasBio ? 7 : 0,
                isComplete: hasBio,
                isOptional: false,
                hint: 'Write a short bio (at least 20 characters)',
                tabPath: '/profile/personal-info',
            },
            {
                id: 'education',
                label: 'Education',
                weight: 20,
                earned: hasEducation ? 20 : 0,
                isComplete: hasEducation,
                isOptional: false,
                hint: 'Add at least one education entry',
                tabPath: '/profile/education',
            },
            {
                id: 'skills',
                label: 'Skills',
                weight: 15,
                earned: hasSkills ? 15 : 0,
                isComplete: hasSkills,
                isOptional: false,
                hint: 'Add at least 3 skills',
                tabPath: '/profile/skills',
            },
            {
                id: 'experience',
                label: 'Experience',
                weight: 15,
                earned: hasExperience ? 15 : 0,
                isComplete: hasExperience,
                isOptional: false,
                hint: 'Add at least one work experience',
                tabPath: '/profile/experience',
            },
            {
                id: 'socials',
                label: 'Social Links',
                weight: 5,
                earned: hasSocials ? 5 : 0,
                isComplete: hasSocials,
                isOptional: true,
                hint: 'Add your GitHub or LinkedIn profile',
                tabPath: '/profile/personal-info',
            },
            {
                id: 'projects',
                label: 'Projects',
                weight: 5,
                earned: hasProjects ? 5 : 0,
                isComplete: hasProjects,
                isOptional: true,
                hint: 'Add at least one project',
                tabPath: '/profile/projects',
            },
            {
                id: 'certificates',
                label: 'Certificates',
                weight: 5,
                earned: hasCertificates ? 5 : 0,
                isComplete: hasCertificates,
                isOptional: true,
                hint: 'Add at least one certificate',
                tabPath: '/profile/certificates',
            },
        ];
    }, [user, personalInfo, education, experience, skills, projects, certificates]);

    const percentage = useMemo(
        () => sections.reduce((sum, s) => sum + s.earned, 0),
        [sections]
    );

    const completedCount = sections.filter((s) => s.isComplete).length;

    return {
        percentage,
        sections,
        completedCount,
        totalCount: sections.length,
        isProfileReady: (threshold = 70) => percentage >= threshold,
    };
}
