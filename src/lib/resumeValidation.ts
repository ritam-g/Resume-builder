import { z } from "zod";

const requiredNumber = (message: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    },
    z.number({ message }).int(message)
  );

export const summarySectionSchema = z.object({
  title: z.string().trim().min(1, "Resume title is required"),
  summery: z.string().trim().min(20, "Summary should be at least 20 characters"),
});

export const personalInfoSectionSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  mobile: requiredNumber("Mobile number is required"),
  country: z.string().trim().min(1, "Country is required"),
  pincode: requiredNumber("Pincode is required"),
  location: z.string().trim().min(1, "Location is required"),
  github: z.string().trim().default(""),
  linkedin: z.string().trim().default(""),
  prtfolio: z.string().trim().default(""),
});

export const workExperienceItemSchema = z.object({
  company: z.string().trim().min(1, "Company name is required"),
  position: z.string().trim().min(1, "Position is required"),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().min(1, "End date is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const workExperienceSectionSchema = z.array(workExperienceItemSchema).min(1, "Add at least one experience");

export const projectItemSchema = z.object({
  project: z.string().trim().min(1, "Project title is required"),
  description: z.string().trim().min(1, "Description is required"),
  githubLink: z.string().trim().min(1, "GitHub link is required"),
  liveLink: z.string().trim().min(1, "Live link is required"),
  techStack: z.array(z.string().trim().min(1)).min(1, "Add at least one technology"),
});

export const projectSectionSchema = z.array(projectItemSchema).min(1, "Add at least one project");

export const educationItemSchema = z.object({
  institute: z.string().trim().min(1, "Institution name is required"),
  degree: z.string().trim().min(1, "Degree is required"),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().min(1, "End date is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const educationSectionSchema = z.array(educationItemSchema).min(1, "Add at least one education entry");

export const skillsSectionSchema = z.object({
  skills: z.array(z.string().trim().min(1, "Skill cannot be empty")).min(1, "Add at least one skill"),
  certifications: z.array(z.string().trim().min(1, "Certification cannot be empty")),
  acheivements: z.array(z.string().trim().min(1, "Achievement cannot be empty")),
});

export function getValidationMessage(error: z.ZodError): string {
  return error.issues[0]?.message || "Please complete the section before saving";
}
