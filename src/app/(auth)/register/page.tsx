"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/store/features/auth/authThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from "@/store/features/auth/authSelectors";
import { toast } from "sonner";
import { User, Mail, Lock, Phone, ArrowRight, Sparkles } from "lucide-react";

const registerSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  mobile: zod
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Mobile number must be digits only" }),
});

type RegisterFormInput = zod.input<typeof registerSchema>;
type RegisterFormData = zod.output<typeof registerSchema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput, object, RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Account created successfully!");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = (data: RegisterFormData) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 bg-black">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl mb-4">
            <Sparkles className="w-6 h-6 text-zinc-100" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Create an account
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Build and optimize resumes with Gemini AI
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="name"
                type="text"
                placeholder="Ritam G"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="email"
                type="email"
                placeholder="ritam@example.com"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="mobile">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="mobile"
                type="tel"
                placeholder="9876543210"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                {...register("mobile")}
              />
            </div>
            {errors.mobile && (
              <p className="text-xs text-red-500 font-medium">
                {errors.mobile.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg py-2.5 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? "Registering..." : "Create Account"}
            {!loading && (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        <div className="text-center text-sm mt-6">
          <span className="text-zinc-400">Already have an account? </span>
          <Link href="/login" className="text-white hover:underline font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
