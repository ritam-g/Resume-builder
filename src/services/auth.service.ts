import { ApiResponse, LooginBody, RegisterBody } from "@/types/apiResponse.type";
import { IUser } from "@/types/user.type";
import apiClient from "./api.client";

export const authService = {
  async register(data: RegisterBody): Promise<ApiResponse<{ user: IUser }>> {
    const response = await apiClient.post<ApiResponse<{ user: IUser }>>("/auth/register", data);
    return response.data;
  },

  async login(data: LooginBody): Promise<ApiResponse<{ user: IUser }>> {
    const response = await apiClient.post<ApiResponse<{ user: IUser }>>("/auth/login", data);
    return response.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.get<ApiResponse<null>>("/auth/logout");
    return response.data;
  },

  async getMe(): Promise<ApiResponse<IUser>> {
    const response = await apiClient.get<ApiResponse<IUser>>("/auth/me");
    return response.data;
  },

  async refreshSession(): Promise<ApiResponse<IUser>> {
    const response = await apiClient.get<ApiResponse<IUser>>("/auth/refresh");
    return response.data;
  }
};
