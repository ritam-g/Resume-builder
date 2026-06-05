import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";
import { LooginBody, RegisterBody } from "@/types/apiResponse.type";
import { getErrorMessage } from "@/lib/error";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterBody, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      if (response.success && response.data) {
        return response.data.user;
      }
      return rejectWithValue(response.message || "Failed to register");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LooginBody, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        return response.data.user;
      }
      return rejectWithValue(response.message || "Failed to login");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      if (response.success) {
        return null;
      }
      return rejectWithValue(response.message || "Failed to logout");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getMeUser = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to fetch user");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Not authenticated"));
    }
  }
);
