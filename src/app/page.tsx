"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMeUser } from "@/store/features/auth/authThunk";
import { selectIsAuthenticated, selectAuthUser } from "@/store/features/auth/authSelectors";
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);

  useEffect(() => {
    // dispatch(getMeUser());
  }, [dispatch]);

  return (
    <div className="relative flex flex-col flex-1 bg-black min-h-screen text-white">
      {/* Background radial highlight */}
      <div className="top-0 left-1/2 absolute bg-radial from-white/[0.03] to-transparent blur-3xl w-full max-w-7xl h-[600px] -translate-x-1/2 pointer-events-none" />

      {/* Top Navigation */}
      <nav className="z-10 flex justify-between items-center bg-zinc-950/40 backdrop-blur-md px-6 border-zinc-900 border-b h-16 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="font-bold text-white tracking-tight">ResuAI</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 px-4 py-2 rounded-lg font-semibold text-black text-xs transition-colors cursor-pointer"
            >
              Go to Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="font-semibold text-zinc-400 hover:text-white text-xs transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 px-4 py-2 rounded-lg font-semibold text-black text-xs transition-colors cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="z-10 relative flex flex-col flex-1 justify-center items-center space-y-8 mx-auto px-6 py-20 max-w-4xl text-center">
        <div className="inline-flex items-center gap-1.5 bg-zinc-900/30 px-3 py-1 border border-zinc-800 rounded-full font-semibold text-zinc-400 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          Powered by Gemini 3.5 AI
        </div>

        <h1 className="font-sans font-extrabold text-white text-4xl sm:text-6xl leading-tight tracking-tight">
          Build ATS-optimized resumes <br className="hidden sm:inline" />
          in seconds with AI.
        </h1>

        <p className="max-w-2xl text-zinc-400 text-base sm:text-lg leading-relaxed">
          Craft professional, modern resumes tailored to pass Applicant Tracking Systems. Auto-write achievements, summaries, project outlines, and fetch direct score suggestions.
        </p>

        <div className="flex sm:flex-row flex-col justify-center gap-4 pt-4 w-full sm:max-w-none max-w-xs">
          <Link
            href={user ? "/dashboard" : "/register"}
            className="group flex justify-center items-center gap-2 bg-white hover:bg-zinc-200 shadow-md px-6 py-3 rounded-lg font-bold text-black text-sm transition-all cursor-pointer"
          >
            {user ? "Go to Dashboard" : "Build Your Resume"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="flex justify-center items-center gap-2 hover:bg-zinc-900 px-6 py-3 border border-zinc-800 rounded-lg font-semibold text-white text-sm transition-all cursor-pointer"
          >
            Sign In
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mx-auto pt-16 w-full max-w-5xl">
          {/* Card 1 */}
          <div className="group relative space-y-3 bg-zinc-950/20 p-6 border border-zinc-900 hover:border-zinc-800 rounded-xl text-left transition-colors">
            <div className="bg-zinc-900 p-2 rounded-lg w-fit text-zinc-400 group-hover:text-white transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-200 group-hover:text-white text-sm transition-colors">
              Generative Content Writer
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Auto-generate descriptions for projects, work histories, summaries, and skills with contextual keywords.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative space-y-3 bg-zinc-950/20 p-6 border border-zinc-900 hover:border-zinc-800 rounded-xl text-left transition-colors">
            <div className="bg-zinc-900 p-2 rounded-lg w-fit text-zinc-400 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-200 group-hover:text-white text-sm transition-colors">
              Real-time ATS Audits
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Scan your resume against modern scanning standard metrics and fetch strengths, weaknesses, and optimization ideas.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative space-y-3 bg-zinc-950/20 p-6 border border-zinc-900 hover:border-zinc-800 rounded-xl text-left transition-colors">
            <div className="bg-zinc-900 p-2 rounded-lg w-fit text-zinc-400 group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-200 group-hover:text-white text-sm transition-colors">
              HttpOnly Session Cookies
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Stateless JWT credential verification built secure against CSRF and XSS. Silent session renewal.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="z-10 relative bg-black mt-auto py-8 border-zinc-950 border-t text-zinc-500 text-xs text-center shrink-0">
        &copy; {new Date().getFullYear()} ResuAI. All rights reserved. Designed for elite developers.
      </footer>
    </div>
  );
}
