export interface Experience {
    _id: string;
    userId: string;
    company: string;
    role: string;
    description?: string;
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
}

export interface CreateExperienceData {
    userId: string;
    company: string;
    role: string;
    description?: string;
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
}
