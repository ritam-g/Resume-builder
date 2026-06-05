import { RootState } from "../../store";

export const selectAiSummary = (state: RootState) => state.ai.summary;
export const selectAiSkills = (state: RootState) => state.ai.skills;
export const selectAiExperience = (state: RootState) => state.ai.experienceDescriptions;
export const selectAiProject = (state: RootState) => state.ai.projectDescriptions;
export const selectAiImprovedText = (state: RootState) => state.ai.improvedText;
export const selectATSScore = (state: RootState) => state.ai.atsScore;
export const selectAiLoading = (state: RootState) => state.ai.loading;
export const selectAiError = (state: RootState) => state.ai.error;
