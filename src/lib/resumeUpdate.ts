import { IEducation, IPersonalInfo, IResume, IWorkExperience, ResumeUpdatePayload, iProject } from "@/types/resume.type";

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function isCompleteWorkExperience(item: Partial<IWorkExperience>): item is IWorkExperience {
  return Boolean(
    normalizeString(item.company) &&
      normalizeString(item.position) &&
      normalizeString(item.startDate) &&
      normalizeString(item.endDate) &&
      normalizeString(item.description)
  );
}

function isCompleteProject(item: Partial<iProject>): item is iProject {
  return Boolean(
    normalizeString(item.project) &&
      normalizeString(item.description) &&
      normalizeString(item.githubLink) &&
      normalizeString(item.liveLink) &&
      Array.isArray(item.techStack) &&
      item.techStack.map(normalizeString).filter(Boolean).length > 0
  );
}

function isCompleteEducation(item: Partial<IEducation>): item is IEducation {
  return Boolean(
    normalizeString(item.institute) &&
      normalizeString(item.degree) &&
      normalizeString(item.startDate) &&
      normalizeString(item.endDate) &&
      normalizeString(item.description)
  );
}

function sanitizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map((item) => normalizeString(item))
    .filter(Boolean);
}

export function sanitizeResumeUpdatePayload(
  payload: Partial<IResume>
): ResumeUpdatePayload | null {
  const updates: ResumeUpdatePayload = {};

  const title = normalizeString(payload.title);
  if (title) {
    updates.title = title;
  }

  const summery = normalizeString(payload.summery);
  if (summery) {
    updates.summery = summery;
  }

  if (payload.personalInfo && typeof payload.personalInfo === "object") {
    const personalInfoSource = payload.personalInfo;
    const personalInfo: IPersonalInfo = {
      fullname: normalizeString(personalInfoSource.fullname),
      email: normalizeString(personalInfoSource.email),
      mobile: normalizeNumber(personalInfoSource.mobile),
      country: normalizeString(personalInfoSource.country),
      pincode: normalizeNumber(personalInfoSource.pincode),
      location: normalizeString(personalInfoSource.location),
      github: normalizeString(personalInfoSource.github),
      linkedin: normalizeString(personalInfoSource.linkedin),
      prtfolio: normalizeString(personalInfoSource.prtfolio),
    };

    if (Object.values(personalInfo).some((value) => (typeof value === "string" ? value.length > 0 : value !== 0))) {
      updates.personalInfo = personalInfo;
    }
  }

  if (Array.isArray(payload.workExperience)) {
    if (payload.workExperience.every((item) => isCompleteWorkExperience(item ?? {}))) {
      updates.workExperience = payload.workExperience as IWorkExperience[];
    }
  }

  if (Array.isArray(payload.projects)) {
    if (payload.projects.every((item) => isCompleteProject(item ?? {}))) {
      updates.projects = payload.projects as iProject[];
    }
  }

  if (Array.isArray(payload.education)) {
    if (payload.education.every((item) => isCompleteEducation(item ?? {}))) {
      updates.education = payload.education as IEducation[];
    }
  }

  const skills = sanitizeStringArray(payload.skills);
  if (skills !== undefined) {
    updates.skills = skills;
  }

  const certifications = sanitizeStringArray(payload.certifications);
  if (certifications !== undefined) {
    updates.certifications = certifications;
  }

  const acheivements = sanitizeStringArray(payload.acheivements);
  if (acheivements !== undefined) {
    updates.acheivements = acheivements;
  }

  return Object.keys(updates).length > 0 ? updates : null;
}
