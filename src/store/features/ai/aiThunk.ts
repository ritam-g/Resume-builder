import { createAsyncThunk } from "@reduxjs/toolkit";
import { aiService } from "@/services/ai.service";
import { getErrorMessage } from "@/lib/error";
import {
  GenerateSummeryBody,
  GenerateSkillsBody,
  GenerateProjectDescriptionBody,
  GenerateExperienceDescriptionBody,
  ImproveContentBody,
  ATSScoreBody,
} from "@/types/ai.types";

export const getAiSummary = createAsyncThunk(
  "ai/summary",
  async (data: GenerateSummeryBody, { rejectWithValue }) => {
    try {
      const response = await aiService.generateSummary(data);
      if (response.success && response.data !== undefined) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to generate summary");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAiSkills = createAsyncThunk(
  "ai/skills",
  async (data: GenerateSkillsBody, { rejectWithValue }) => {
    try {
      const response = await aiService.generateSkills(data);
      if (response.success && response.data !== undefined) {
        // Parse parsed skills payload since backend replies as stringified JSON containing skills array
        try {
          const parsed = JSON.parse(response.data);
          return parsed.skills || [];
        } catch {
          return [response.data]; // Fallback to list containing raw text if JSON parses incorrectly
        }
      }
      return rejectWithValue(response.message || "Failed to generate skills");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAiExperience = createAsyncThunk(
  "ai/experience",
  async (data: GenerateExperienceDescriptionBody, { rejectWithValue }) => {
    try {
      const response = await aiService.generateExperienceDescription(data);
      if (response.success && response.data !== undefined) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to generate experience bullet points");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAiProject = createAsyncThunk(
  "ai/project",
  async (data: GenerateProjectDescriptionBody, { rejectWithValue }) => {
    try {
      const response = await aiService.generateProjectDescription(data);
      if (response.success && response.data !== undefined) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to generate project bullet points");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAiImprovedText = createAsyncThunk(
  "ai/improve",
  async (data: ImproveContentBody, { rejectWithValue }) => {
    try {
      const response = await aiService.improveContent(data);
      if (response.success && response.data !== undefined) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to improve content");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getATSScoreReport = createAsyncThunk(
  "ai/ats",
  async (data: ATSScoreBody, { rejectWithValue }) => {
    try {
      const response = await aiService.getATSScore(data);
      if (response.success && response.data !== undefined) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to calculate ATS score");
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
