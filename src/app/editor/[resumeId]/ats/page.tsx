"use client";

import React, { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMeUser } from "@/store/features/auth/authThunk";
import { fetchResumeById } from "@/store/features/resume/resumeThunk";
import { getATSScoreReport } from "@/store/features/ai/aiThunk";
import { selectAuthLoading, selectIsAuthenticated } from "@/store/features/auth/authSelectors";
import { selectCurrentResume, selectResumeLoading } from "@/store/features/resume/resumeSelectors";
import { selectATSScore, selectAiLoading, selectAiError } from "@/store/features/ai/aiSelectors";
import { clearAiState } from "@/store/features/ai/aiSlice";
import { IResume } from "@/types/resume.type";
import { toast } from "sonner";
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RotateCw,
} from "lucide-react";

function flattenResumeToText(resume: IResume): string {
  const personalInfo = resume.personalInfo || {};

  const experienceText = (resume.workExperience || [])
    .map(
      (entry) =>
        `Company: ${entry.company}\nPosition: ${entry.position}\nDuration: ${entry.startDate} - ${entry.endDate}\nDescription: ${entry.description}`
    )
    .join("\n\n");

  const projectsText = (resume.projects || [])
    .map(
      (project) =>
        `Project: ${project.project}\nTech Stack: ${project.techStack?.join(", ")}\nDescription: ${project.description}`
    )
    .join("\n\n");

  const educationText = (resume.education || [])
    .map(
      (entry) =>
        `Institute: ${entry.institute}\nDegree: ${entry.degree}\nDuration: ${entry.startDate} - ${entry.endDate}\nDescription: ${entry.description}`
    )
    .join("\n\n");

  return `
NAME: ${personalInfo.fullname || ""}
EMAIL: ${personalInfo.email || ""}
MOBILE: ${personalInfo.mobile || ""}
LOCATION: ${personalInfo.location || ""}, ${personalInfo.country || ""}

SUMMARY:
${resume.summery || ""}

EXPERIENCE:
${experienceText}

PROJECTS:
${projectsText}

EDUCATION:
${educationText}

SKILLS:
${(resume.skills || []).join(", ")}

CERTIFICATIONS:
${(resume.certifications || []).join(", ")}

ACHIEVEMENTS:
${(resume.acheivements || []).join(", ")}
  `.trim();
}

export default function ATSScorePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const resumeId = params.resumeId as string;

  const authLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentResume = useAppSelector(selectCurrentResume);
  const resumeLoading = useAppSelector(selectResumeLoading);
  const atsReport = useAppSelector(selectATSScore);
  const aiLoading = useAppSelector(selectAiLoading);
  const aiError = useAppSelector(selectAiError);

  useEffect(() => {
    dispatch(getMeUser());
  }, [dispatch]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && resumeId) {
      dispatch(fetchResumeById(resumeId));
    }

    return () => {
      dispatch(clearAiState());
    };
  }, [isAuthenticated, resumeId, dispatch]);

  const triggerAnalysis = useCallback(() => {
    if (!currentResume) return;

    const text = flattenResumeToText(currentResume);
    dispatch(getATSScoreReport({ resumeText: text }));
  }, [currentResume, dispatch]);

  useEffect(() => {
    if (currentResume && !atsReport && !aiLoading.ats) {
      triggerAnalysis();
    }
  }, [currentResume, atsReport, aiLoading.ats, triggerAnalysis]);

  const handleReanalyze = () => {
    toast.info("Starting new ATS scan...");
    triggerAnalysis();
  };

  if (authLoading || resumeLoading) {
    return (
      <div className="flex-1 flex justify-center items-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <TrendingUp className="w-8 h-8 animate-pulse text-zinc-400" />
          <p className="text-zinc-400 text-sm font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black min-h-screen text-white">
      <header className="h-14 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md px-6 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/editor/${resumeId}`)}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Editor
          </button>
          <div className="h-4 w-px bg-zinc-800" />
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-zinc-400" />
            ATS Audit Report
          </h1>
        </div>

        {atsReport && !aiLoading.ats && (
          <button
            onClick={handleReanalyze}
            className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Re-scan Resume
          </button>
        )}
      </header>

      <main className="max-w-4xl w-full mx-auto px-6 py-10 flex-1 flex flex-col gap-8">
        {aiLoading.ats ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-zinc-300">Evaluating ATS score...</h3>
            <p className="text-zinc-500 text-xs mt-1 text-center max-w-xs">
              Gemini AI is parsing structural sections, calculating resume density, and matching keyword metrics.
            </p>
          </div>
        ) : aiError ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <h3 className="text-lg font-bold text-zinc-300">Scan failed</h3>
            <p className="text-zinc-500 text-sm max-w-sm">
              We encountered an issue communicating with the ATS analyzer service.
            </p>
            <button
              onClick={handleReanalyze}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : atsReport ? (
          <div className="space-y-8 animate-fade-in">
            <div className="relative border border-zinc-800 rounded-2xl p-8 bg-zinc-950/30 overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  ATS Score Analysis
                </h2>
                <p className="text-zinc-400 text-sm max-w-md">
                  This report shows how well search algorithms, keyword scanners, and candidate managers read your document. Aim for a score of 80+.
                </p>
              </div>

              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    className="stroke-zinc-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    className="stroke-white transition-all duration-1000"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - atsReport.score / 100)}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {atsReport.score}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-zinc-900 rounded-xl p-6 bg-zinc-950/20 space-y-4">
                <h3 className="font-bold text-zinc-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Key Strengths
                </h3>
                <ul className="space-y-3">
                  {atsReport.strengths.map((strength, idx) => (
                    <li key={idx} className="text-xs leading-relaxed text-zinc-400 flex items-start gap-2">
                      <span className="text-zinc-500 select-none font-bold mt-0.5">-</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-zinc-900 rounded-xl p-6 bg-zinc-950/20 space-y-4">
                <h3 className="font-bold text-zinc-200 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Identified Weaknesses
                </h3>
                <ul className="space-y-3">
                  {atsReport.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-xs leading-relaxed text-zinc-400 flex items-start gap-2">
                      <span className="text-zinc-500 select-none font-bold mt-0.5">-</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-zinc-900 rounded-xl p-6 bg-zinc-950/20 space-y-4">
              <h3 className="font-bold text-zinc-200 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-zinc-400" />
                Actionable Recommendations
              </h3>
              <div className="space-y-3">
                {atsReport.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex gap-3 text-xs leading-relaxed text-zinc-400">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300 select-none">
                      {idx + 1}
                    </span>
                    <span className="flex-1 mt-0.5">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center py-20 text-center">
            <HelpCircle className="w-12 h-12 text-zinc-500 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-zinc-300">No report available</h3>
            <button
              onClick={handleReanalyze}
              className="mt-4 px-4 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer"
            >
              Analyze Resume
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
