import api from '@src/utils/axios_api';

export async function generateResume(templateId: string, jobDescription: string) {
    const res = await api.post('/ai/generate-resume', { templateId, jobDescription });
    return res.data as { success: boolean; resume:any, filledTemplate: { _id: string; name: string; data: object } };
}
