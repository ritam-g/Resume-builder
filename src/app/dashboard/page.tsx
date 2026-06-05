"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMeUser, logoutUser } from "@/store/features/auth/authThunk";
import { fetchAllResumes, createNewResume, deleteResumeById } from "@/store/features/resume/resumeThunk";
import { selectAuthUser, selectIsAuthenticated, selectAuthLoading } from "@/store/features/auth/authSelectors";
import { selectAllResumes, selectResumeLoading, selectResumeDeleting } from "@/store/features/resume/resumeSelectors";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  FileText, 
  LogOut, 
  Calendar, 
  ArrowUpDown, 
  User, 
  TrendingUp,
  Sparkles,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);
  const resumes = useAppSelector(selectAllResumes);
  const resumeLoading = useAppSelector(selectResumeLoading);
  const resumeDeleting = useAppSelector(selectResumeDeleting);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "created" | "title">("updated");
  const [resumeToDelete, setResumeToDelete] = useState<{ id: string; title: string } | null>(null);

  // Validate session on mount
  useEffect(() => {
    dispatch(getMeUser());
  }, [dispatch]);

  // If validation finishes and user is not logged in, redirect to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch user resumes on authentication success
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllResumes());
    }
  }, [isAuthenticated, dispatch]);

  const handleCreateResume = async () => {
    const action = await dispatch(createNewResume());
    if (createNewResume.fulfilled.match(action)) {
      toast.success("Resume initialized!");
      router.push(`/editor/${action.payload._id}`);
    } else {
      toast.error("Failed to create resume");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      toast.success("Logged out successfully");
      router.push("/login");
    });
  };

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;

    const action = await dispatch(deleteResumeById(resumeToDelete.id));
    if (deleteResumeById.fulfilled.match(action)) {
      toast.success(`Deleted ${resumeToDelete.title}`);
      setResumeToDelete(null);
    } else {
      toast.error("Failed to delete resume");
    }
  };

  // Filter resumes
  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort resumes
  const sortedResumes = [...filteredResumes].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    const dateA = new Date(sortBy === "updated" ? a.updatedAt || 0 : a.createdAt || 0).getTime();
    const dateB = new Date(sortBy === "updated" ? b.updatedAt || 0 : b.createdAt || 0).getTime();
    return dateB - dateA; // Descending dates
  });

  if (authLoading && !user) {
    return (
      <div className="flex-1 flex justify-center items-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 animate-pulse text-zinc-400" />
          <p className="text-zinc-400 text-sm font-medium">Validating session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col bg-black min-h-screen text-white">
      {/* Header bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <Sparkles className="w-5 h-5 text-white" />
          <span className="font-bold tracking-tight text-white">ResuAI</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all text-xs cursor-pointer font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-6 py-10 flex-1 flex flex-col gap-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Create and manage your professional, ATS-optimized resumes.
            </p>
          </div>
          <button
            onClick={handleCreateResume}
            disabled={resumeLoading}
            className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-4 py-2.5 rounded-lg text-sm font-bold shadow-md disabled:opacity-50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Resume
          </button>
        </div>

        {/* Filters and Search toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-900/20">
            <ArrowUpDown className="w-4 h-4 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-sm text-zinc-300 border-none outline-none cursor-pointer pr-4"
            >
              <option value="updated" className="bg-zinc-950 text-white">Last Modified</option>
              <option value="created" className="bg-zinc-950 text-white">Date Created</option>
              <option value="title" className="bg-zinc-950 text-white">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Resumes Grid */}
        {sortedResumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => router.push(`/editor/${resume._id}`)}
                className="group flex flex-col justify-between border border-zinc-800 hover:border-zinc-600 rounded-xl p-6 bg-zinc-950/40 hover:bg-zinc-950 transition-all cursor-pointer shadow-sm relative overflow-hidden"
              >
                {/* Visual Glassmorphic gradient on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.03] transition-all" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!resume._id) return;
                    setResumeToDelete({ id: resume._id, title: resume.title });
                  }}
                  className="absolute top-4 right-4 z-10 rounded-full border border-zinc-800 bg-zinc-950/80 p-2 text-zinc-500 opacity-0 transition-all group-hover:opacity-100 hover:border-red-900 hover:text-red-400"
                  aria-label={`Delete ${resume.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-zinc-700">
                      <FileText className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors text-base truncate max-w-[180px]">
                        {resume.title}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate max-w-[180px]">
                        {resume.personalInfo?.fullname || "No Name"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {resume.summery || "No summary provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-900 mt-6 pt-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Mod: {new Date(resume.updatedAt || "").toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-zinc-400 group-hover:text-white font-semibold flex items-center gap-0.5 transition-colors">
                    Edit <ArrowUpDown className="w-3 h-3 rotate-90" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
            <FileText className="w-12 h-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-bold text-zinc-300">No resumes found</h3>
            <p className="text-zinc-500 text-sm mt-1 max-w-xs text-center">
              {searchQuery ? "No resumes match your search filter." : "Get started by initializing your first professional resume template."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateResume}
                disabled={resumeLoading}
                className="mt-6 flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Initialize Resume
              </button>
            )}
          </div>
        )}
      </main>

      {resumeToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-resume-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="delete-resume-title" className="text-lg font-bold text-white">
                      Delete resume?
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      This will permanently remove <span className="text-zinc-200 font-semibold">{resumeToDelete.title}</span> from your workspace.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeToDelete(null)}
                    className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-white"
                    aria-label="Close delete dialog"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setResumeToDelete(null)}
                className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={resumeDeleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resumeDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
