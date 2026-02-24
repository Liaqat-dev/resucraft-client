export interface ProfileState {
  personalInfo: PersonalInfo;
  projects: Project[];
  certificates: Certificate[];
  loading: boolean;
  projectsLoading: boolean;
  certificatesLoading: boolean;
  error: string | null;
}

//Personal Information
export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  profession?: string;
  address?: string;
  dob?: string;
  bio?: string;
  phone?: string | number;
  github?: string;
  linkedin?: string;
}

export type UpdatePersonalInfoData = {
  [key in keyof PersonalInfo]: string | number  | null;
};


// Education
export interface Education {
  _id: string;
  user: string;
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface CreateEducationData {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}


//User Experience
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

//User Education
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

// Project
export interface Project {
  _id: string;
  user: string;
  title: string;
  description?: string;
  liveUrl?: string;
  repoUrl?: string;
  startDate?: string;
  endDate?: string;
  technologies: string[];
  status: 'planned' | 'in-progress' | 'completed';
}

export interface CreateProjectData {
  title: string;
  description?: string;
  liveUrl?: string;
  repoUrl?: string;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
  status?: 'planned' | 'in-progress' | 'completed';
}

// Certificate
export interface Certificate {
  _id: string;
  user: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
}

export interface CreateCertificateData {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
}

export interface TypeOptionsDataRecord {
  id: string;
  label: string;
}

// user followers
export interface UserFollowerRecord {
  name: string;
  email: string;
  phone: string;
  image: string;
  viewMoreLink: string;
  isFollowing: boolean;
}

// user documnents
export interface UserDocumnentMediaRecord {
  type: "image" | "video";
  src?: string;
  ima?: string;
  title: string;
  size: string;
}

// user document file
export interface UserDocumentFileRecord {
  color: string;
  title: string;
  size: string;
}

// user documents record
export interface UserDocumentsFolderRecord {
  name: string;
  details: string;
}

// user projects
export interface UserProjectRecord {
  title: string;
  link: string;
  description: string;
  icon: string;
  iconColor: string;
  tag: string;
  views: number;
  avatars: string[];
  color: string;
}
