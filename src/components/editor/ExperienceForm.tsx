"use client";

import React, { useState } from "react";
import { IWorkExperience, WorkExperienceSectionData } from "@/types/resume.type";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAiExperience } from "@/store/features/ai/aiThunk";
import { selectAiLoading } from "@/store/features/ai/aiSelectors";
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { getValidationMessage, workExperienceSectionSchema } from "@/lib/resumeValidation";

interface ExperienceFormProps {
  initialData?: IWorkExperience[];
  onChange: (data: IWorkExperience[]) => void;
  onSave: (data: WorkExperienceSectionData) => void | Promise<void>;
  saving?: boolean;
}

export default function ExperienceForm({
  initialData = [],
  onChange,
  onSave,
  saving = false,
}: ExperienceFormProps) {
  const dispatch = useAppDispatch();
  const aiLoading = useAppSelector(selectAiLoading);

  const [experiences, setExperiences] = useState<IWorkExperience[]>(initialData);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    initialData.length > 0 ? 0 : null
  );

  // AI assistant form inputs
  const [aiAssistantIndex, setAiAssistantIndex] = useState<number | null>(null);
  const [skillsStr, setSkillsStr] = useState("");

  const updateExperiences = (updatedList: IWorkExperience[]) => {
    setExperiences(updatedList);
    onChange(updatedList);
  };

  const handleAddExperience = () => {
    const newItem: IWorkExperience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    const newList = [...experiences, newItem];
    updateExperiences(newList);
    setExpandedIndex(newList.length - 1);
  };

  const handleRemoveExperience = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newList = experiences.filter((_, i) => i !== idx);
    updateExperiences(newList);
    if (expandedIndex === idx) {
      setExpandedIndex(newList.length > 0 ? 0 : null);
    }
  };

  const handleFieldChange = (idx: number, field: keyof IWorkExperience, value: string) => {
    const newList = experiences.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateExperiences(newList);
  };

  const handleGenerateExperienceAI = async (idx: number) => {
    const exp = experiences[idx];
    if (!exp.company || !exp.position || !exp.startDate || !exp.endDate) {
      toast.warning("Please fill Company, Position, Start Date, and End Date first");
      return;
    }
    if (!skillsStr) {
      toast.warning("Please suggest some keywords or skills for this experience");
      return;
    }

    const skillsArray = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);

    const action = await dispatch(
      getAiExperience({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        skills: skillsArray,
      })
    );

    if (getAiExperience.fulfilled.match(action)) {
      // action.payload is string[] containing 4 bullet points
      const joinedBullets = action.payload.map((point) => `• ${point}`).join("\n");
      handleFieldChange(idx, "description", joinedBullets);
      setAiAssistantIndex(null);
      setSkillsStr("");
      toast.success("AI Bullet points built successfully!");
    } else {
      toast.error("Failed to build experience description");
    }
  };

  const handleSaveSection = async () => {
    const parsed = workExperienceSectionSchema.safeParse(experiences);
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
          <h3 className="text-lg font-bold text-white">Work Experience</h3>
          <p className="text-sm text-zinc-400">Add positions, timelines, and details.</p>
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
            onClick={handleAddExperience}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Experience
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/20"
            >
              {/* Header summary row */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="flex justify-between items-center p-4 bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors cursor-pointer"
              >
                <div className="space-y-0.5 truncate pr-4 text-left">
                  <h4 className="font-bold text-zinc-200 text-sm truncate">
                    {exp.position || "Untitled Position"}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">
                    {exp.company || "Company Name"} &bull; {exp.startDate || "Start"} -{" "}
                    {exp.endDate || "End"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleRemoveExperience(index, e)}
                    className="p-1 text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
              </div>

              {/* Collapsible expanded forms */}
              {isExpanded && (
                <div className="p-5 border-t border-zinc-900 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleFieldChange(index, "company", e.target.value)}
                        placeholder="Google"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">Position / Job Title</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleFieldChange(index, "position", e.target.value)}
                        placeholder="Software Engineer"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleFieldChange(index, "startDate", e.target.value)}
                        placeholder="Jan 2023"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => handleFieldChange(index, "endDate", e.target.value)}
                        placeholder="Present"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Description area */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-zinc-400">Job Description & Accomplishments</label>
                      <button
                        type="button"
                        onClick={() => setAiAssistantIndex(aiAssistantIndex === index ? null : index)}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Bullet Points
                      </button>
                    </div>

                    {aiAssistantIndex === index && (
                      <div className="my-2 border border-zinc-800 rounded-lg p-4 bg-zinc-950/60 space-y-3">
                        <span className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">
                          Keyword Context (Skills, tools used in project)
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={skillsStr}
                            onChange={(e) => setSkillsStr(e.target.value)}
                            placeholder="React, AWS, TypeScript"
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleGenerateExperienceAI(index)}
                            disabled={aiLoading.experience}
                            className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-3 py-2 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {aiLoading.experience ? "Writing..." : "Write"}
                          </button>
                        </div>
                      </div>
                    )}

                    <textarea
                      value={exp.description}
                      onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                      rows={5}
                      placeholder="Write 3-4 bullet points detailing your key deliverables and quantitative results. Use action verbs (Designed, Managed, Engineered)."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20 text-sm text-zinc-500">
          No experience listed. Click &quot;Add Experience&quot; to begin.
        </div>
      )}
    </div>
  );
}
