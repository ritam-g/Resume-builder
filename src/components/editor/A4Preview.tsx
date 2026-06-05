"use client";

import React from "react";
import { IResume } from "@/types/resume.type";
import { Mail, Phone, MapPin, Link, Globe } from "lucide-react";

interface A4PreviewProps {
  data: IResume | null;
  zoom: number;
}

export default function A4Preview({ data, zoom }: A4PreviewProps) {
  if (!data) return null;

  const {
    title,
    summery,
    personalInfo,
    workExperience = [],
    projects = [],
    education = [],
    skills = [],
    certifications = [],
    acheivements = [],
  } = data;

  return (
    <div
      className="print-area bg-white border border-zinc-200 rounded-lg shadow-2xl origin-top transition-transform overflow-auto"
      style={{
        transform: `scale(${zoom / 100})`,
        width: "210mm",
        height: "297mm",
      }}
    >
      <div className="a4-page text-black p-[20mm] text-left leading-normal flex flex-col h-full justify-between">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center border-b border-zinc-300 pb-4 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-serif uppercase">
              {personalInfo?.fullname || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-zinc-700 font-sans">
              {personalInfo?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo?.mobile && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  {personalInfo.mobile}
                </span>
              )}
              {(personalInfo?.location || personalInfo?.country) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {personalInfo.location && `${personalInfo.location}, `}
                  {personalInfo.country}
                  {personalInfo.pincode ? ` (${personalInfo.pincode})` : ""}
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-zinc-700 font-sans mt-1">
              {personalInfo?.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline text-zinc-900"
                >
                  <Link className="w-3.5 h-3.5 text-zinc-500" />
                  LinkedIn
                </a>
              )}
              {personalInfo?.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline text-zinc-900"
                >
                  <Link className="w-3.5 h-3.5 text-zinc-500" />
                  GitHub
                </a>
              )}
              {personalInfo?.prtfolio && (
                <a
                  href={personalInfo.prtfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline text-zinc-900"
                >
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  Portfolio
                </a>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {summery && (
            <div className="space-y-1">
              <h2 className="text-sm font-bold tracking-wider uppercase border-b border-black font-sans pb-0.5">
                Professional Summary
              </h2>
              <p className="text-sm text-zinc-800 font-serif leading-relaxed text-justify whitespace-pre-line">
                {summery}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold tracking-wider uppercase border-b border-black font-sans pb-0.5">
                Work Experience
              </h2>
              <div className="space-y-3">
                {workExperience.map((exp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-baseline font-serif">
                      <span className="font-bold text-sm">
                        {exp.company} &mdash; <span className="italic">{exp.position}</span>
                      </span>
                      <span className="text-xs text-zinc-600 font-sans">
                        {exp.startDate} &ndash; {exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-800 font-serif leading-relaxed text-justify whitespace-pre-line pl-2">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold tracking-wider uppercase border-b border-black font-sans pb-0.5">
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-baseline font-serif">
                      <span className="font-bold text-sm">
                        {proj.project}{" "}
                        {proj.techStack?.length > 0 && (
                          <span className="text-[11px] font-sans font-normal text-zinc-600 bg-zinc-100 border border-zinc-200 rounded px-1.5 py-0.5 ml-2">
                            {proj.techStack.join(", ")}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-sans text-zinc-500">
                        {proj.githubLink && (
                          <a
                            href={proj.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline hover:text-black"
                          >
                            Github
                          </a>
                        )}
                        {proj.liveLink && (
                          <a
                            href={proj.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline hover:text-black"
                          >
                            Live
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-800 font-serif leading-relaxed text-justify whitespace-pre-line pl-2">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold tracking-wider uppercase border-b border-black font-sans pb-0.5">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <div key={index} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-serif">
                      <span className="font-bold text-sm">
                        {edu.institute} &mdash; <span className="italic">{edu.degree}</span>
                      </span>
                      <span className="text-xs text-zinc-600 font-sans">
                        {edu.startDate} &ndash; {edu.endDate}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-xs text-zinc-700 font-serif leading-normal pl-2">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-1">
              <h2 className="text-sm font-bold tracking-wider uppercase border-b border-black font-sans pb-0.5">
                Skills
              </h2>
              <p className="text-xs text-zinc-800 font-serif leading-relaxed">
                {skills.join(", ")}
              </p>
            </div>
          )}

          {/* Certifications and Achievements combined optionally to save A4 space */}
          {(certifications.length > 0 || acheivements.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {certifications.length > 0 && (
                <div className="space-y-1">
                  <h2 className="text-xs font-bold tracking-wider uppercase border-b border-black font-sans pb-0.5">
                    Certifications
                  </h2>
                  <ul className="list-disc pl-4 text-xs font-serif text-zinc-800 space-y-0.5">
                    {certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
              {acheivements.length > 0 && (
                <div className="space-y-1">
                  <h2 className="text-xs font-bold tracking-wider uppercase border-b border-black font-sans pb-0.5">
                    Achievements
                  </h2>
                  <ul className="list-disc pl-4 text-xs font-serif text-zinc-800 space-y-0.5">
                    {acheivements.map((ach, index) => (
                      <li key={index}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic bottom branding */}
        <div className="text-[10px] text-zinc-400 font-sans text-center mt-auto border-t border-zinc-100 pt-2 no-print">
          Generated via ResuAI Platform &mdash; ATS-optimised layout
        </div>
      </div>
    </div>
  );
}
