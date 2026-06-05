"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAiSummary, getAiImprovedText } from "@/store/features/ai/aiThunk";
import { selectAiLoading } from "@/store/features/ai/aiSelectors";
import { Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { summarySectionSchema, getValidationMessage } from "@/lib/resumeValidation";
import { SummarySectionData } from "@/types/resume.type";

interface SummaryFormProps {
  title: string;
  summery: string; // note spelling
  onChange: (data: { title: string; summery: string }) => void;
  onSave: (data: SummarySectionData) => void | Promise<void>;
  saving?: boolean;
}

export default function SummaryForm({
  title,
  summery,
  onChange,
  onSave,
  saving = false,
}: SummaryFormProps) {
  const dispatch = useAppDispatch();

  // AI Dialog Inputs
  const [showAssistant, setShowAssistant] = useState(false);
  const [jobTitle, setJobTitle] = useState(title || "");
  const [skills, setSkills] = useState("");
  const [expYears, setExpYears] = useState("3");

  const aiLoading = useAppSelector(selectAiLoading);

  // Alert updates to parent
  const handleFieldChange = (newTitle: string, newSummary: string) => {
    onChange({ title: newTitle, summery: newSummary });
  };

  const handleGenerateSummary = async () => {
    if (!jobTitle) {
      toast.warning("Please specify a target Job Title first");
      return;
    }
    const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
    
    const action = await dispatch(
      getAiSummary({
        jobTitle,
        skills: skillsArray,
        experenceLevel: expYears, // Matches spelling: "experenceLevel"
      })
    );

    if (getAiSummary.fulfilled.match(action)) {
      handleFieldChange(title, action.payload);
      setShowAssistant(false);
      toast.success("AI Summary generated!");
    } else {
      toast.error("Failed to generate summary");
    }
  };

  const handleImproveSummary = async () => {
    if (!summery) {
      toast.warning("Please write some summary text to improve first");
      return;
    }
    const action = await dispatch(getAiImprovedText({ content: summery }));
    if (getAiImprovedText.fulfilled.match(action)) {
      handleFieldChange(title, action.payload);
      toast.success("AI Content improved!");
    } else {
      toast.error("Failed to improve summary");
    }
  };

  const handleSaveSection = async () => {
    const parsed = summarySectionSchema.safeParse({ title, summery });
    if (!parsed.success) {
      toast.error(getValidationMessage(parsed.error));
      return;
    }

    await onSave(parsed.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Title & Summary</h3>
          <p className="text-sm text-zinc-400">Introduce yourself and your goals.</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={handleSaveSection}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black transition-all text-xs cursor-pointer font-bold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Section"}
          </button>
          <button
            type="button"
            onClick={() => setShowAssistant(!showAssistant)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 text-zinc-300 hover:text-white transition-all text-xs cursor-pointer font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Assistant
          </button>
        </div>
      </div>

      {showAssistant && (
        <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-950/80 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            AI Summary Generator
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Software Engineer"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Experience (Years)</label>
              <input
                type="number"
                value={expYears}
                onChange={(e) => setExpYears(e.target.value)}
                placeholder="3"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Skills (Comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, NextJS, NodeJS"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900">
            <button
              type="button"
              onClick={() => setShowAssistant(false)}
              className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={aiLoading.summary}
              className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              {aiLoading.summary ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">Resume Name/Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              handleFieldChange(e.target.value, summery);
            }}
            placeholder="E.g., Senior Full Stack Dev Resume"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-zinc-400">Professional Summary</label>
            {summery && (
              <button
                type="button"
                onClick={handleImproveSummary}
                disabled={aiLoading.improve}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${aiLoading.improve ? "animate-spin" : ""}`} />
                Improve content with AI
              </button>
            )}
          </div>
          <textarea
            value={summery}
            onChange={(e) => {
              handleFieldChange(title, e.target.value);
            }}
            rows={6}
            placeholder="Write a brief, professional summary outlining your key expertise and achievements."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600 resize-y"
          />
        </div>
      </div>
    </div>
  );
}
