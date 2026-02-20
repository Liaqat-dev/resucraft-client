export interface Education {
    _id: string;
    user: string;
    school: string;             // previously institution
    degree: string;
    fieldOfStudy?: string;
    startDate: string;          // previously startYear
    endDate?: string;           // previously endYear
    description?: string;
}


export interface CreateEducationData {
    userId: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    description?: string;
}
