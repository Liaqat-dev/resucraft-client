import api from '@src/utils/axios_api';

export interface AtsCategory {
    score: number;
    max: number;
    label: string;
    details: string[];
    matched?: string[];
    missing?: string[];
}

export interface AtsBreakdown {
    contactInfo: AtsCategory;
    sections: AtsCategory;
    contentQuality: AtsCategory;
    skills: AtsCategory;
    keywords?: AtsCategory;
}

export interface AtsResult {
    totalScore: number;
    grade: 'A' | 'B' | 'C' | 'D';
    hasJD: boolean;
    breakdown: AtsBreakdown;
    suggestions: string[];
}

export async function scoreResume(resumeData: object, jobDescription = ''): Promise<AtsResult> {
    const res = await api.post('/ats-score', { resumeData, jobDescription });
    return res.data as AtsResult;
}
