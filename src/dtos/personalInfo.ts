export interface PersonalInfo {
    name?: string;
    dob?: string;
    bio?: string;
    phone?: string | number;
    github?: string;
    linkedin?: string;
    profilePic?: string | null;
}

export type UpdatePersonalInfoData = {
    [key in keyof PersonalInfo]: string | number | File | null;
};