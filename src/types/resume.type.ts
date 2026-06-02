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
    user_id: Types.ObjectId;
    title: string;
    summery: string;
    certifications?: string[];
    acheivements?: string[];
    skills: string[];

}