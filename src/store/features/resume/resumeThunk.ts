import { createAsyncThunk } from "@reduxjs/toolkit";
import { resumeService } from "@/services/resume.service";
import { IResume, ResumeUpdatePayload } from "@/types/resume.type";
import { getErrorMessage } from "@/lib/error";

export const fetchAllResumes = createAsyncThunk(
  "resume/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resumeService.getAllResumes();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to fetch resumes");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createNewResume = createAsyncThunk(
  "resume/create",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resumeService.createResume();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to create resume");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  "resume/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeService.getResumeById(id);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to fetch resume");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateResumeDetails = createAsyncThunk(
  "resume/update",
  async ({ id, updates }: { id: string; updates: ResumeUpdatePayload }, { rejectWithValue }) => {
    try {
      const response = await resumeService.updateResume(id, updates);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to update resume");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteResumeById = createAsyncThunk(
  "resume/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeService.deleteResume(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || "Failed to delete resume");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
