import { RootState } from "../../store";

export const selectAllResumes = (state: RootState) => state.resume.resumes;
export const selectCurrentResume = (state: RootState) => state.resume.currentResume;
export const selectResumeLoading = (state: RootState) => state.resume.loading;
export const selectResumeSaving = (state: RootState) => state.resume.saving;
export const selectResumeDeleting = (state: RootState) => state.resume.deleting;
export const selectResumeError = (state: RootState) => state.resume.error;
