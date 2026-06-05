import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ATSReportData } from "@/services/ai.service";
import {
  getAiSummary,
  getAiSkills,
  getAiExperience,
  getAiProject,
  getAiImprovedText,
  getATSScoreReport,
} from "./aiThunk";

interface AiState {
  summary: string | null;
  skills: string[];
  experienceDescriptions: string[];
  projectDescriptions: string[];
  improvedText: string | null;
  atsScore: ATSReportData | null;
  loading: {
    summary: boolean;
    skills: boolean;
    experience: boolean;
    project: boolean;
    improve: boolean;
    ats: boolean;
  };
  error: string | null;
}

const initialState: AiState = {
  summary: null,
  skills: [],
  experienceDescriptions: [],
  projectDescriptions: [],
  improvedText: null,
  atsScore: null,
  loading: {
    summary: false,
    skills: false,
    experience: false,
    project: false,
    improve: false,
    ats: false,
  },
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAiState: (state) => {
      state.summary = null;
      state.skills = [];
      state.experienceDescriptions = [];
      state.projectDescriptions = [];
      state.improvedText = null;
      state.atsScore = null;
      state.error = null;
    },
    clearImprovedText: (state) => {
      state.improvedText = null;
    },
  },
  extraReducers: (builder) => {
    // Summary
    builder
      .addCase(getAiSummary.pending, (state) => {
        state.loading.summary = true;
        state.error = null;
      })
      .addCase(getAiSummary.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading.summary = false;
        state.summary = action.payload;
      })
      .addCase(getAiSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error = action.payload as string;
      });

    // Skills
    builder
      .addCase(getAiSkills.pending, (state) => {
        state.loading.skills = true;
        state.error = null;
      })
      .addCase(getAiSkills.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading.skills = false;
        state.skills = action.payload;
      })
      .addCase(getAiSkills.rejected, (state, action) => {
        state.loading.skills = false;
        state.error = action.payload as string;
      });

    // Experience Description
    builder
      .addCase(getAiExperience.pending, (state) => {
        state.loading.experience = true;
        state.error = null;
      })
      .addCase(getAiExperience.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading.experience = false;
        state.experienceDescriptions = action.payload;
      })
      .addCase(getAiExperience.rejected, (state, action) => {
        state.loading.experience = false;
        state.error = action.payload as string;
      });

    // Project Description
    builder
      .addCase(getAiProject.pending, (state) => {
        state.loading.project = true;
        state.error = null;
      })
      .addCase(getAiProject.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading.project = false;
        state.projectDescriptions = action.payload;
      })
      .addCase(getAiProject.rejected, (state, action) => {
        state.loading.project = false;
        state.error = action.payload as string;
      });

    // Improved Content
    builder
      .addCase(getAiImprovedText.pending, (state) => {
        state.loading.improve = true;
        state.error = null;
      })
      .addCase(getAiImprovedText.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading.improve = false;
        state.improvedText = action.payload;
      })
      .addCase(getAiImprovedText.rejected, (state, action) => {
        state.loading.improve = false;
        state.error = action.payload as string;
      });

    // ATS Score Report
    builder
      .addCase(getATSScoreReport.pending, (state) => {
        state.loading.ats = true;
        state.error = null;
      })
      .addCase(getATSScoreReport.fulfilled, (state, action: PayloadAction<ATSReportData>) => {
        state.loading.ats = false;
        state.atsScore = action.payload;
      })
      .addCase(getATSScoreReport.rejected, (state, action) => {
        state.loading.ats = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAiState, clearImprovedText } = aiSlice.actions;
export default aiSlice.reducer;
