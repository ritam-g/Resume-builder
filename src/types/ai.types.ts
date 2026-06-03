export interface GenerateSummeryBody {
    experenceLevel: string;
    skills: string[];
    jobTitle: string;
}

export interface GenerateSkillsBody {
    expreenceLevel: string;
    jobTitle: string
}
export interface GenerateProjectDescriptionBody {
    projectTitle: string;
    jobTitle: string;
    techStack: string[];
}

export interface GenerateExperienceDescriptionBody {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    skills: string[];
}

export interface ImproveContentBody{
    content:string
}
