"use client";

import React, { useState } from "react";
import { iProject, ProjectSectionData } from "@/types/resume.type";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAiProject } from "@/store/features/ai/aiThunk";
import { selectAiLoading } from "@/store/features/ai/aiSelectors";
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { getValidationMessage, projectSectionSchema } from "@/lib/resumeValidation";

interface ProjectsFormProps {
  initialData?: iProject[];
  onChange: (data: iProject[]) => void;
  onSave: (data: ProjectSectionData) => void | Promise<void>;
  saving?: boolean;
}

export default function ProjectsForm({
  initialData = [],
  onChange,
  onSave,
  saving = false,
}: ProjectsFormProps) {
  const dispatch = useAppDispatch();
  const aiLoading = useAppSelector(selectAiLoading);

  const [projects, setProjects] = useState<iProject[]>(initialData);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    initialData.length > 0 ? 0 : null
  );

  // AI assistant form inputs
  const [aiAssistantIndex, setAiAssistantIndex] = useState<number | null>(null);
  const [jobTitle, setJobTitle] = useState("");

  const updateProjects = (updatedList: iProject[]) => {
    setProjects(updatedList);
    onChange(updatedList);
  };

  const handleAddProject = () => {
    const newItem: iProject = {
      project: "", // Matches schema: "project" (name)
      description: "",
      githubLink: "",
      liveLink: "",
      techStack: [],
    };
    const newList = [...projects, newItem];
    updateProjects(newList);
    setExpandedIndex(newList.length - 1);
  };

  const handleRemoveProject = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newList = projects.filter((_, i) => i !== idx);
    updateProjects(newList);
    if (expandedIndex === idx) {
      setExpandedIndex(newList.length > 0 ? 0 : null);
    }
  };

  const handleFieldChange = (idx: number, field: keyof iProject, value: string | string[]) => {
    const newList = projects.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateProjects(newList);
  };

  const handleGenerateProjectAI = async (idx: number) => {
    const proj = projects[idx];
    if (!proj.project || proj.techStack.length === 0) {
      toast.warning("Please specify Project Title and Tech Stack first");
      return;
    }
    if (!jobTitle) {
      toast.warning("Please specify your target Job Title (e.g. Frontend Engineer)");
      return;
    }

    const action = await dispatch(
      getAiProject({
        projectTitle: proj.project,
        jobTitle,
        techStack: proj.techStack,
      })
    );

    if (getAiProject.fulfilled.match(action)) {
      // action.payload is string[] containing 4 bullet points
      const joinedBullets = action.payload.map((point) => `• ${point}`).join("\n");
      handleFieldChange(idx, "description", joinedBullets);
      setAiAssistantIndex(null);
      toast.success("AI Project description built successfully!");
    } else {
      toast.error("Failed to build project description");
    }
  };

  const handleSaveSection = async () => {
    const parsed = projectSectionSchema.safeParse(projects);
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
          <h3 className="text-lg font-bold text-white">Projects</h3>
          <p className="text-sm text-zinc-400">Showcase your portfolio and open source work.</p>
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
            onClick={handleAddProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((proj, index) => {
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
                    {proj.project || "Untitled Project"}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">
                    {proj.techStack?.length > 0
                      ? proj.techStack.join(", ")
                      : "No Tech Stack specified"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleRemoveProject(index, e)}
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

              {/* Expanded contents */}
              {isExpanded && (
                <div className="p-5 border-t border-zinc-900 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">Project Title</label>
                      <input
                        type="text"
                        value={proj.project}
                        onChange={(e) => handleFieldChange(index, "project", e.target.value)}
                        placeholder="E-commerce Portal"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">
                        Tech Stack (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={proj.techStack.join(", ")}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "techStack",
                            e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder="React, Redux, Node, MongoDB"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">GitHub Link</label>
                      <input
                        type="text"
                        value={proj.githubLink}
                        onChange={(e) => handleFieldChange(index, "githubLink", e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">Live Website URL</label>
                      <input
                        type="text"
                        value={proj.liveLink}
                        onChange={(e) => handleFieldChange(index, "liveLink", e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Project description bullet points */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-zinc-400">Project Description</label>
                      <button
                        type="button"
                        onClick={() => setAiAssistantIndex(aiAssistantIndex === index ? null : index)}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Project Bullets
                      </button>
                    </div>

                    {aiAssistantIndex === index && (
                      <div className="my-2 border border-zinc-800 rounded-lg p-4 bg-zinc-950/60 space-y-3">
                        <span className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">
                          Target Professional Profile (Job Title)
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Full Stack Engineer"
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleGenerateProjectAI(index)}
                            disabled={aiLoading.project}
                            className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-3 py-2 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {aiLoading.project ? "Generating..." : "Generate"}
                          </button>
                        </div>
                      </div>
                    )}

                    <textarea
                      value={proj.description}
                      onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                      rows={5}
                      placeholder="Write 3-4 bullet points detailing features, algorithms, scaling, and architectural highlights."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-600 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20 text-sm text-zinc-500">
          No projects listed. Click &quot;Add Project&quot; to begin.
        </div>
      )}
    </div>
  );
}
