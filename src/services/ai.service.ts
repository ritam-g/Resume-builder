import {
  GenerateSummeryBody,
  GenerateSkillsBody,
  GenerateProjectDescriptionBody,
  GenerateExperienceDescriptionBody,
  ImproveContentBody,
  ATSScoreBody,
} from "@/types/ai.types";
import { ApiResponse } from "@/types/apiResponse.type";
import apiClient from "./api.client";

export interface ATSReportData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export const aiService = {
  async generateSummary(data: GenerateSummeryBody): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>("/ai/generate-summary", data);
    return response.data;
  },

  async generateSkills(data: GenerateSkillsBody): Promise<ApiResponse<string>> {
    // Note: Backend returns data as JSON string representing the object with `{ "skills": [...] }`
    const response = await apiClient.post<ApiResponse<string>>("/ai/generate-skills", data);
    return response.data;
  },

  async generateExperienceDescription(
    data: GenerateExperienceDescriptionBody
  ): Promise<ApiResponse<string[]>> {
    const response = await apiClient.post<ApiResponse<string[]>>(
      "/ai/generate-experience-description",
      data
    );
    return response.data;
  },

  async generateProjectDescription(
    data: GenerateProjectDescriptionBody
  ): Promise<ApiResponse<string[]>> {
    const response = await apiClient.post<ApiResponse<string[]>>(
      "/ai/generate-project-description",
      data
    );
    return response.data;
  },

  async improveContent(data: ImproveContentBody): Promise<ApiResponse<string>> {
    // Note backend URL spelling: "inprove-content"
    const response = await apiClient.post<ApiResponse<string>>("/ai/inprove-content", data);
    return response.data;
  },

  async getATSScore(data: ATSScoreBody): Promise<ApiResponse<ATSReportData>> {
    const response = await apiClient.post<ApiResponse<ATSReportData>>("/ai/ats-score", data);
    return response.data;
  },
};
