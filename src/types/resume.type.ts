import { Types } from "mongoose";

export interface IPersonalInfo {
    fullname: string;
    email: string;
    mobile: number;
    country: string;
    pincode: number;
    location: string;
    github: string;
    linkedin: string;
    prtfolio: string;
}

export interface IWorkExperience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface iProject {
    project: string;
    description: string;
    githubLink: string;
    liveLink: string;
    techStack: string[];
}

export interface IEducation {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
}


export interface IResume {
    personalInfo: IPersonalInfo;
    workExperience?: IWorkExperience[];
    projects: iProject[];
    education: IEducation[];
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    user_id: Types.ObjectId;
    title: string;
    summery: string;
    certifications?: string[];
    acheivements?: string[];
    skills: string[];

}

export interface SummarySectionData {
    title: string;
    summery: string;
}

export type PersonalInfoSectionData = IPersonalInfo;

export type WorkExperienceSectionData = IWorkExperience[];

export type ProjectSectionData = iProject[];

export type EducationSectionData = IEducation[];

export interface SkillsSectionData {
    skills: string[];
    certifications: string[];
    acheivements: string[];
}

export type ResumeUpdatableSection =
    | "title"
    | "summery"
    | "personalInfo"
    | "workExperience"
    | "projects"
    | "education"
    | "skills"
    | "certifications"
    | "acheivements";

export type ResumeUpdatePayload = Partial<Pick<IResume, ResumeUpdatableSection>>;
