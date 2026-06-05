import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IResume } from "@/types/resume.type";
import {
  fetchAllResumes,
  createNewResume,
  fetchResumeById,
  updateResumeDetails,
  deleteResumeById,
} from "./resumeThunk";

interface ResumeState {
  resumes: IResume[];
  currentResume: IResume | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  resumes: [],
  currentResume: null,
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
    // Optimistic details updating local state action for immediate editor changes
    updateResumeLocal: (state, action: PayloadAction<Partial<IResume>>) => {
      if (state.currentResume) {
        state.currentResume = {
          ...state.currentResume,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchAllResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllResumes.fulfilled, (state, action: PayloadAction<IResume[]>) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchAllResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create New
    builder
      .addCase(createNewResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewResume.fulfilled, (state, action: PayloadAction<IResume>) => {
        state.loading = false;
        state.resumes.unshift(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(createNewResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch By Id
    builder
      .addCase(fetchResumeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action: PayloadAction<IResume>) => {
        state.loading = false;
        state.currentResume = action.payload;
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Details
    builder
      .addCase(updateResumeDetails.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateResumeDetails.fulfilled, (state, action: PayloadAction<IResume>) => {
        state.saving = false;
        state.currentResume = action.payload;
        // Sync modified resume inside cache list
        const idx = state.resumes.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) {
          state.resumes[idx] = action.payload;
        }
      })
      .addCase(updateResumeDetails.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Delete Resume
    builder
      .addCase(deleteResumeById.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteResumeById.fulfilled, (state, action) => {
        state.deleting = false;
        state.resumes = state.resumes.filter((resume) => resume._id !== action.payload);
        if (state.currentResume?._id === action.payload) {
          state.currentResume = null;
        }
      })
      .addCase(deleteResumeById.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentResume, updateResumeLocal } = resumeSlice.actions;
export default resumeSlice.reducer;
