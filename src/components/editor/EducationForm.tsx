"use client";

import React, { useState } from "react";
import { EducationSectionData, IEducation } from "@/types/resume.type";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { getValidationMessage, educationSectionSchema } from "@/lib/resumeValidation";
import { toast } from "sonner";

interface EducationFormProps {
  initialData?: IEducation[];
  onChange: (data: IEducation[]) => void;
  onSave: (data: EducationSectionData) => void | Promise<void>;
  saving?: boolean;
}

export default function EducationForm({
  initialData = [],
  onChange,
  onSave,
  saving = false,
}: EducationFormProps) {
  const [educationList, setEducationList] = useState<IEducation[]>(initialData);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    initialData.length > 0 ? 0 : null
  );

  const updateEducation = (updatedList: IEducation[]) => {
    setEducationList(updatedList);
    onChange(updatedList);
  };

  const handleAddEducation = () => {
    const newItem: IEducation = {
      institute: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    const newList = [...educationList, newItem];
    updateEducation(newList);
    setExpandedIndex(newList.length - 1);
  };

  const handleRemoveEducation = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newList = educationList.filter((_, i) => i !== idx);
    updateEducation(newList);
    if (expandedIndex === idx) {
      setExpandedIndex(newList.length > 0 ? 0 : null);
    }
  };

  const handleFieldChange = (idx: number, field: keyof IEducation, value: string) => {
    const newList = educationList.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateEducation(newList);
  };

  const handleSaveSection = async () => {
    const parsed = educationSectionSchema.safeParse(educationList);
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
          <h3 className="text-lg font-bold text-white">Education</h3>
          <p className="text-sm text-zinc-400">Add degrees, academic institutions, and dates.</p>
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
            onClick={handleAddEducation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Education
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {educationList.map((edu, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/20"
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="flex justify-between items-center p-4 bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors cursor-pointer"
              >
                <div className="space-y-0.5 truncate pr-4 text-left">
                  <h4 className="font-bold text-zinc-200 text-sm truncate">
                    {edu.degree || "Untitled Degree"}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">
                    {edu.institute || "Institution Name"} &bull; {edu.startDate || "Start"} -{" "}
                    {edu.endDate || "End"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleRemoveEducation(index, e)}
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

              {/* Collapsible content */}
              {isExpanded && (
                <div className="p-5 border-t border-zinc-900 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">
                        School / University Name
                      </label>
                      <input
                        type="text"
                        value={edu.institute}
                        onChange={(e) => handleFieldChange(index, "institute", e.target.value)}
                        placeholder="Stanford University"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">
                        Degree / Major Field
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleFieldChange(index, "degree", e.target.value)}
                        placeholder="Bachelor of Science in Computer Science"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => handleFieldChange(index, "startDate", e.target.value)}
                        placeholder="Sep 2018"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => handleFieldChange(index, "endDate", e.target.value)}
                        placeholder="Jun 2022"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">
                      Description / Honors / GPA (Optional)
                    </label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                      rows={3}
                      placeholder="Graduated with Honors. Specialization in Artificial Intelligence. Minor in Mathematics."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-zinc-500 placeholder-zinc-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {educationList.length === 0 && (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20 text-sm text-zinc-500">
          No education details listed. Click &quot;Add Education&quot; to begin.
        </div>
      )}
    </div>
  );
}
