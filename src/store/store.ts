import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import resumeReducer from "./features/resume/resumeSlice";
import aiReducer from "./features/ai/aiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents errors with non-serializable fields if mongoose fields are present
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
