"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMeUser } from "@/store/features/auth/authThunk";
import { fetchResumeById, updateResumeDetails } from "@/store/features/resume/resumeThunk";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "@/store/features/auth/authSelectors";
import {
  selectCurrentResume,
  selectResumeLoading,
  selectResumeSaving,
} from "@/store/features/resume/resumeSelectors";
import { clearCurrentResume, updateResumeLocal } from "@/store/features/resume/resumeSlice";
import { IResume, ResumeUpdatePayload } from "@/types/resume.type";
import { sanitizeResumeUpdatePayload } from "@/lib/resumeUpdate";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Sparkles, 
  User, 
  Briefcase, 
  FolderGit, 
  GraduationCap, 
  Code,
  Eye, 
  Printer,
  TrendingUp,
  CloudLightning
} from "lucide-react";

import PersonalInfoForm from "@/components/editor/PersonalInfoForm";
import SummaryForm from "@/components/editor/SummaryForm";
import ExperienceForm from "@/components/editor/ExperienceForm";
import ProjectsForm from "@/components/editor/ProjectsForm";
import EducationForm from "@/components/editor/EducationForm";
import SkillsForm from "@/components/editor/SkillsForm";
import A4Preview from "@/components/editor/A4Preview";

type SectionType = "summary" | "personal" | "experience" | "projects" | "education" | "skills";

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const resumeId = params.resumeId as string;

  // Selectors
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);
  const currentResume = useAppSelector(selectCurrentResume);
  const resumeLoading = useAppSelector(selectResumeLoading);
  const resumeSaving = useAppSelector(selectResumeSaving);

  // Component States
  const [activeSection, setActiveSection] = useState<SectionType>("summary");
  const [zoom, setZoom] = useState(75); // zoom factor for preview panel (percentage)

  // Validate session on mount
  useEffect(() => {
    dispatch(getMeUser());
  }, [dispatch]);

  // Auth Redirects
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch target resume
  useEffect(() => {
    if (isAuthenticated && resumeId) {
      dispatch(fetchResumeById(resumeId));
    }
    return () => {
      dispatch(clearCurrentResume());
    };
  }, [isAuthenticated, resumeId, dispatch]);

  const handleLocalUpdate = (updates: Partial<IResume>) => {
    dispatch(updateResumeLocal(updates));
  };

  const handleSaveSection = async (updates: ResumeUpdatePayload) => {
    const updatesToSave = sanitizeResumeUpdatePayload(updates);

    if (!updatesToSave) {
      toast.error("Please complete the section before saving");
      return;
    }

    const action = await dispatch(
      updateResumeDetails({
        id: resumeId,
        updates: updatesToSave,
      })
    );

    if (updateResumeDetails.fulfilled.match(action)) {
      toast.success("Section saved");
    } else {
      const message = typeof action.payload === "string" ? action.payload : "Failed to save section";
      toast.error(message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (authLoading || resumeLoading) {
    return (
      <div className="flex flex-1 justify-center items-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <CloudLightning className="w-8 h-8 text-zinc-400 animate-bounce" />
          <p className="font-medium text-zinc-400 text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!currentResume) return null;

  return (
    <div className="bg-green-2overflow-hidden flex flex-col flex-1 bg- bg-black h-screen text-white">
      {/* Top Navbar */}
      <header className="z-10 flex justify-between items-center bg-zinc-950/40 backdrop-blur-md px-6 border-zinc-900 border-b h-14 no-print shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1 font-semibold text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <div className="bg-zinc-800 w-px h-4" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm tracking-tight">{currentResume.title}</span>
            <span className="flex items-center gap-1 bg-zinc-900/20 px-2 py-0.5 border border-zinc-800 rounded-full font-medium text-[10px] text-zinc-400">
              <span className={`w-1.5 h-1.5 rounded-full ${resumeSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
              {resumeSaving ? "Saving changes..." : "Saved"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Selector */}
          <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 border border-zinc-800 rounded-lg text-zinc-400 text-xs">
            <Eye className="w-3.5 h-3.5" />
            <select
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="bg-transparent border-none outline-none font-semibold text-white cursor-pointer"
            >
              <option value={50} className="bg-zinc-950">50%</option>
              <option value={60} className="bg-zinc-950">60%</option>
              <option value={75} className="bg-zinc-950">75%</option>
              <option value={90} className="bg-zinc-950">90%</option>
              <option value={100} className="bg-zinc-950">100%</option>
            </select>
          </div>

          <button
            onClick={() => router.push(`/editor/${resumeId}/ats`)}
            className="flex items-center gap-1 bg-zinc-900 px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 rounded-lg font-semibold text-white text-xs transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            ATS Audit
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 px-3.5 py-1.5 rounded-lg font-bold text-black text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print PDF
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Sidebar navigation + Forms Panel */}
        <div className="flex border-zinc-900 border-r w-full lg:w-[550px] overflow-hidden no-print shrink-0">
          {/* Vertical Menu Buttons */}
          <nav className="flex flex-col items-center gap-4 bg-zinc-950/20 py-6 border-zinc-900 border-r w-16">
            <button
              onClick={() => setActiveSection("summary")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeSection === "summary"
                  ? "bg-white text-black font-bold"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Summary"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection("personal")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeSection === "personal"
                  ? "bg-white text-black font-bold"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Personal Info"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection("experience")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeSection === "experience"
                  ? "bg-white text-black font-bold"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Experience"
            >
              <Briefcase className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection("projects")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeSection === "projects"
                  ? "bg-white text-black font-bold"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Projects"
            >
              <FolderGit className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection("education")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeSection === "education"
                  ? "bg-white text-black font-bold"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Education"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection("skills")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeSection === "skills"
                  ? "bg-white text-black font-bold"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Skills & Other"
            >
              <Code className="w-5 h-5" />
            </button>
          </nav>

          {/* Form Content Panel */}
          <div className="flex-1 bg-zinc-950/20 p-6 md:p-8 overflow-y-auto">
            {activeSection === "summary" && (
              <SummaryForm
                title={currentResume.title}
                summery={currentResume.summery} // note spelling
                onChange={(data) => {
                  // handle local update
                  handleLocalUpdate({ title: data.title, summery: data.summery });
                }}
                onSave={(data) => handleSaveSection(data)}
                saving={resumeSaving}
              />
            )}
            {activeSection === "personal" && (
              <PersonalInfoForm
                initialData={currentResume.personalInfo}
                onChange={(data) => handleLocalUpdate({ personalInfo: data })}
                onSave={(data) => handleSaveSection({ personalInfo: data })}
                saving={resumeSaving}
              />
            )}
            {activeSection === "experience" && (
              <ExperienceForm
                initialData={currentResume.workExperience}
                onChange={(data) => handleLocalUpdate({ workExperience: data })}
                onSave={(data) => handleSaveSection({ workExperience: data })}
                saving={resumeSaving}
              />
            )}
            {activeSection === "projects" && (
              <ProjectsForm
                initialData={currentResume.projects}
                onChange={(data) => handleLocalUpdate({ projects: data })}
                onSave={(data) => handleSaveSection({ projects: data })}
                saving={resumeSaving}
              />
            )}
            {activeSection === "education" && (
              <EducationForm
                initialData={currentResume.education}
                onChange={(data) => handleLocalUpdate({ education: data })}
                onSave={(data) => handleSaveSection({ education: data })}
                saving={resumeSaving}
              />
            )}
            {activeSection === "skills" && (
              <SkillsForm
                skills={currentResume.skills}
                certifications={currentResume.certifications}
                acheivements={currentResume.acheivements}
                jobTitleContext={currentResume.title}
                onChange={(data) => {
                  handleLocalUpdate({
                    skills: data.skills,
                    certifications: data.certifications,
                    acheivements: data.acheivements,
                  });
                }}
                onSave={(data) => handleSaveSection(data)}
                saving={resumeSaving}
              />
            )}
          </div>
        </div>

        {/* Right Side: Live preview sheet canvas */}
        <div className="flex flex-1 justify-center items-start bg-zinc-900/30 px-6 py-10 overflow-auto no-print-bg">
          <A4Preview data={currentResume} zoom={zoom} />
        </div>
      </div>
    </div>
  );
}
