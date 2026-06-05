"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IPersonalInfo, PersonalInfoSectionData } from "@/types/resume.type";
import { personalInfoSectionSchema } from "@/lib/resumeValidation";
import { toast } from "sonner";

interface PersonalInfoFormProps {
  initialData?: IPersonalInfo;
  onChange: (data: IPersonalInfo) => void;
  onSave: (data: PersonalInfoSectionData) => void | Promise<void>;
  saving?: boolean;
}

type PersonalInfoInput = z.input<typeof personalInfoSectionSchema>;
type PersonalInfoOutput = z.output<typeof personalInfoSectionSchema>;

export default function PersonalInfoForm({
  initialData,
  onChange,
  onSave,
  saving = false,
}: PersonalInfoFormProps) {
  const defaultValues = useMemo(
    () =>
      initialData || {
        fullname: "",
        email: "",
        mobile: 0,
        country: "",
        pincode: 0,
        location: "",
        github: "",
        linkedin: "",
        prtfolio: "",
      },
    [initialData]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoInput, object, PersonalInfoOutput>({
    resolver: zodResolver(personalInfoSectionSchema),
    defaultValues,
  });

  const formValues = useWatch({ control });
  const onChangeRef = useRef(onChange);
  const lastEmittedJsonRef = useRef(JSON.stringify(defaultValues));

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const currentValues = formValues ?? defaultValues;
    const formValuesJson = JSON.stringify(currentValues);
    if (formValuesJson === lastEmittedJsonRef.current) {
      return;
    }

    const parsed = personalInfoSectionSchema.safeParse(currentValues);
    if (parsed.success) {
      lastEmittedJsonRef.current = formValuesJson;
      onChangeRef.current(parsed.data);
    }
  }, [formValues, defaultValues]);

  const handleSaveSection = handleSubmit(
    (data) => {
      onSave(data);
    },
    () => {
      toast.error("Please fix the highlighted personal info fields before saving");
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Personal Information</h3>
          <p className="text-sm text-zinc-400">Manage contact details and social handles.</p>
        </div>
        <button
          type="button"
          onClick={handleSaveSection}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black transition-all text-xs cursor-pointer font-bold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Section"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">Full Name</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            placeholder="John Doe"
            {...register("fullname")}
          />
          {errors.fullname && <p className="text-xs text-red-500">{errors.fullname.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">Email Address</label>
          <input
            type="email"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            placeholder="john@example.com"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">Mobile Phone</label>
          <input
            type="tel"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            placeholder="1234567890"
            {...register("mobile")}
          />
          {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">Location (City)</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            placeholder="San Francisco"
            {...register("location")}
          />
          {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">Country</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            placeholder="United States"
            {...register("country")}
          />
          {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">Pincode / Zipcode</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            placeholder="94103"
            {...register("pincode")}
          />
          {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">LinkedIn Link</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            placeholder="https://linkedin.com/in/..."
            {...register("linkedin")}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400">GitHub Link</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            placeholder="https://github.com/..."
            {...register("github")}
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Portfolio Link</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            placeholder="https://johndoe.me"
            {...register("prtfolio")}
          />
        </div>
      </div>
    </div>
  );
}
