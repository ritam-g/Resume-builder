import { ApiResponse } from "@/types/apiResponse.type";
import { IResume, ResumeUpdatePayload } from "@/types/resume.type";
import apiClient from "./api.client";

export const resumeService = {
  async createResume(): Promise<ApiResponse<IResume>> {
    const response = await apiClient.post<ApiResponse<IResume>>("/resumes/create");
    return response.data;
  },

  async getAllResumes(): Promise<ApiResponse<IResume[]>> {
    const response = await apiClient.get<ApiResponse<IResume[]>>("/resumes/get-all");
    return response.data;
  },

  async getResumeById(id: string): Promise<ApiResponse<IResume>> {
    const response = await apiClient.get<ApiResponse<IResume>>(`/resumes/${id}`);
    return response.data;
  },

  async updateResume(id: string, updates: ResumeUpdatePayload): Promise<ApiResponse<IResume>> {
    const response = await apiClient.patch<ApiResponse<IResume>>(`/resumes/${id}`, updates);
    return response.data;
  },

  async deleteResume(id: string): Promise<ApiResponse<{ _id: string }>> {
    const response = await apiClient.delete<ApiResponse<{ _id: string }>>(`/resumes/${id}`);
    return response.data;
  }
};
