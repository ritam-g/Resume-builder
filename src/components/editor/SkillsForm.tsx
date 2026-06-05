"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAiSkills } from "@/store/features/ai/aiThunk";
import { selectAiLoading } from "@/store/features/ai/aiSelectors";
import { Trash2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { getValidationMessage, skillsSectionSchema } from "@/lib/resumeValidation";
import { SkillsSectionData } from "@/types/resume.type";

interface SkillsFormProps {
  skills: string[];
  certifications?: string[];
  acheivements?: string[]; // note spelling
  onChange: (data: {
    skills: string[];
    certifications: string[];
    acheivements: string[];
  }) => void;
  onSave: (data: SkillsSectionData) => void | Promise<void>;
  saving?: boolean;
  jobTitleContext?: string;
}

export default function SkillsForm({
  skills = [],
  certifications = [],
  acheivements = [],
  onChange,
  onSave,
  saving = false,
  jobTitleContext = "",
}: SkillsFormProps) {
  const dispatch = useAppDispatch();
  const aiLoading = useAppSelector(selectAiLoading);

  // States
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [achInput, setAchInput] = useState("");

  // AI assistant states
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [jobTitle, setJobTitle] = useState(jobTitleContext);
  const [expLevel, setExpLevel] = useState("3");

  const updateFields = (
    updatedSkills: string[],
    updatedCerts: string[],
    updatedAchs: string[]
  ) => {
    onChange({
      skills: updatedSkills,
      certifications: updatedCerts,
      acheivements: updatedAchs,
    });
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      toast.warning("Skill already added");
      return;
    }
    const newSkills = [...skills, trimmed];
    updateFields(newSkills, certifications, acheivements);
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    const newSkills = skills.filter((s) => s !== skill);
    updateFields(newSkills, certifications, acheivements);
  };

  const handleAddCert = () => {
    const trimmed = certInput.trim();
    if (!trimmed) return;
    const newCerts = [...certifications, trimmed];
    updateFields(skills, newCerts, acheivements);
    setCertInput("");
  };

  const handleRemoveCert = (idx: number) => {
    const newCerts = certifications.filter((_, i) => i !== idx);
    updateFields(skills, newCerts, acheivements);
  };

  const handleAddAch = () => {
    const trimmed = achInput.trim();
    if (!trimmed) return;
    const newAchs = [...acheivements, trimmed];
    updateFields(skills, certifications, newAchs);
    setAchInput("");
  };

  const handleRemoveAch = (idx: number) => {
    const newAchs = acheivements.filter((_, i) => i !== idx);
    updateFields(skills, certifications, newAchs);
  };

  const handleGetAiSkills = async () => {
    if (!jobTitle) {
      toast.warning("Please specify a target Job Title first");
      return;
    }

    const action = await dispatch(
      getAiSkills({
        jobTitle,
        expreenceLevel: expLevel, // Matches spelling: "expreenceLevel"
      })
    );

    if (getAiSkills.fulfilled.match(action)) {
      // action.payload is a string[] representing the suggested skills
      const newSkills = [...skills];
      let addedCount = 0;
      action.payload.forEach((skill: string) => {
        if (!newSkills.includes(skill)) {
          newSkills.push(skill);
          addedCount++;
        }
      });
      updateFields(newSkills, certifications, acheivements);
      setShowAiAssistant(false);
      toast.success(`AI suggested skills added! (${addedCount} new skills)`);
    } else {
      toast.error("Failed to generate skills");
    }
  };

  const handleSaveSection = async () => {
    const parsed = skillsSectionSchema.safeParse({
      skills,
      certifications,
      acheivements,
    });

    if (!parsed.success) {
      toast.error(getValidationMessage(parsed.error));
      return;
    }

    await onSave(parsed.data);
  };

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Skills</h3>
            <p className="text-sm text-zinc-400">List tech stacks, methodologies, or soft skills.</p>
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
              onClick={() => setShowAiAssistant(!showAiAssistant)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70 text-zinc-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Recommendations
            </button>
          </div>
        </div>

        {/* AI Assistant Drawer */}
        {showAiAssistant && (
          <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-950/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              AI Skills Recommendations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Full Stack Engineer"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Experience Level (Years)</label>
                <input
                  type="number"
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value)}
                  placeholder="3"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => setShowAiAssistant(false)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGetAiSkills}
                disabled={aiLoading.skills}
                className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                {aiLoading.skills ? "Fetching..." : "Fetch Recommendations"}
              </button>
            </div>
          </div>
        )}

        {/* Input box */}
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill(skillInput);
              }
            }}
            placeholder="Add a skill (e.g. React) and press Enter"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
          />
          <button
            type="button"
            onClick={() => handleAddSkill(skillInput)}
            className="px-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-sm text-white cursor-pointer font-bold"
          >
            Add
          </button>
        </div>

        {/* Badges container */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-full text-xs font-medium group transition-colors"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="p-0.5 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <span className="text-xs text-zinc-600 italic">No skills listed yet.</span>
          )}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-4 border-t border-zinc-900 pt-6">
        <div>
          <h3 className="text-lg font-bold text-white">Certifications</h3>
          <p className="text-sm text-zinc-400">Include industry certifications and licenses.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCert();
              }
            }}
            placeholder="AWS Certified Solutions Architect"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
          />
          <button
            type="button"
            onClick={handleAddCert}
            className="px-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-sm text-white cursor-pointer font-bold"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg text-sm text-zinc-300"
            >
              <span>{cert}</span>
              <button
                type="button"
                onClick={() => handleRemoveCert(index)}
                className="text-zinc-500 hover:text-red-500 transition-colors p-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-4 border-t border-zinc-900 pt-6">
        <div>
          <h3 className="text-lg font-bold text-white">Achievements</h3>
          <p className="text-sm text-zinc-400">Highlight professional awards, competitions, or scholarships.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={achInput}
            onChange={(e) => setAchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddAch();
              }
            }}
            placeholder="Won 1st Place at TechCrunch Hackathon 2024"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
          />
          <button
            type="button"
            onClick={handleAddAch}
            className="px-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-sm text-white cursor-pointer font-bold"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {acheivements.map((ach, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg text-sm text-zinc-300"
            >
              <span>{ach}</span>
              <button
                type="button"
                onClick={() => handleRemoveAch(index)}
                className="text-zinc-500 hover:text-red-500 transition-colors p-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
