"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  internshipApplicationSchema,
  InternshipApplicationData,
} from "@/lib/validation/schemas";
import { InternshipOpportunity } from "@/content/internships";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle2, Loader2, X, Send } from "lucide-react";

interface InternshipApplyModalProps {
  opportunity: InternshipOpportunity;
  isOpen: boolean;
  onClose: () => void;
}

export function InternshipApplyModal({
  opportunity,
  isOpen,
  onClose,
}: InternshipApplyModalProps) {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "unconfigured"
  >("idle");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InternshipApplicationData>({
    resolver: zodResolver(internshipApplicationSchema),
    defaultValues: {
      opportunityId: opportunity.id,
      fullName: "",
      email: "",
      phone: "",
      education: "",
      relevantSkills: "",
      motivationStatement: "",
      portfolioUrl: "",
      linkedInUrl: "",
      applicantMiddleName: "",
      consentGiven: true,
    },
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onSubmit = async (data: InternshipApplicationData) => {
    setSubmitStatus("submitting");
    setResponseMessage("");

    try {
      const res = await fetch("/api/internships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 201) {
        setSubmitStatus("success");
        setResponseMessage(result.message);
        setApplicationId(result.applicationId || "");
        reset();
      } else if (res.status === 503) {
        setSubmitStatus("unconfigured");
        setResponseMessage(
          result.error ||
            "Database backend not yet connected. Set DATABASE_URL in .env to store applications."
        );
      } else {
        setSubmitStatus("error");
        setResponseMessage(result.error || "Submission failed. Please verify the form inputs.");
      }
    } catch {
      setSubmitStatus("error");
      setResponseMessage("Network error while submitting. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close application form"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
            Application: {opportunity.department}
          </span>
          <h3 id="modal-title" className="text-xl sm:text-2xl font-bold text-white">
            {opportunity.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Duration: {opportunity.duration} &bull; {opportunity.compensationStatus}
          </p>
        </div>

        {submitStatus === "success" ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <h4 className="font-bold text-white text-lg">Application Submitted</h4>
            </div>
            <p className="text-sm text-emerald-300 leading-relaxed">{responseMessage}</p>
            {applicationId && (
              <p className="text-xs font-mono text-emerald-400/90">
                Application Tracking ID: <span className="font-bold">{applicationId}</span>
              </p>
            )}
            <div className="pt-4 flex gap-3">
              <Button onClick={onClose} variant="primary" size="sm">
                Close Dialog
              </Button>
            </div>
          </div>
        ) : (
          <>
            {submitStatus === "unconfigured" && (
              <div className="p-4 mb-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Backend Storage Setup Notice</span>
                </div>
                <p>{responseMessage}</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 mb-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{responseMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <input type="hidden" {...register("opportunityId")} value={opportunity.id} />

              {/* Bot honeypot */}
              <div className="hidden" aria-hidden="true">
                <input type="text" tabIndex={-1} {...register("applicantMiddleName")} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="app-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="app-name"
                    type="text"
                    placeholder="Jordan Smith"
                    {...register("fullName")}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-400 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="app-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="app-email"
                    type="email"
                    placeholder="jordan@university.edu"
                    {...register("email")}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="app-education" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Institution & Program <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="app-education"
                    type="text"
                    placeholder="e.g. State University, B.S. CS 3rd Year"
                    {...register("education")}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  {errors.education && (
                    <p className="text-xs text-rose-400 mt-1">{errors.education.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="app-phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Phone (Optional)
                  </label>
                  <input
                    id="app-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register("phone")}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="app-skills" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Technical Skills & Languages <span className="text-rose-400">*</span>
                </label>
                <input
                  id="app-skills"
                  type="text"
                  placeholder="e.g. TypeScript, React, Node.js, SQL, Git"
                  {...register("relevantSkills")}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                {errors.relevantSkills && (
                  <p className="text-xs text-rose-400 mt-1">{errors.relevantSkills.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="app-github" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    GitHub / Portfolio URL
                  </label>
                  <input
                    id="app-github"
                    type="url"
                    placeholder="https://github.com/yourhandle"
                    {...register("portfolioUrl")}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  {errors.portfolioUrl && (
                    <p className="text-xs text-rose-400 mt-1">{errors.portfolioUrl.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="app-linkedin" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    LinkedIn Profile URL
                  </label>
                  <input
                    id="app-linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    {...register("linkedInUrl")}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  {errors.linkedInUrl && (
                    <p className="text-xs text-rose-400 mt-1">{errors.linkedInUrl.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="app-motivation" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Statement of Motivation <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="app-motivation"
                  rows={4}
                  placeholder="Explain why you want to join this apprenticeship and what technical challenges you wish to tackle..."
                  {...register("motivationStatement")}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y"
                />
                {errors.motivationStatement && (
                  <p className="text-xs text-rose-400 mt-1">
                    {errors.motivationStatement.message}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="app-consent"
                  type="checkbox"
                  {...register("consentGiven")}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-cyan-400"
                />
                <label htmlFor="app-consent" className="text-xs text-slate-400">
                  I certify the accuracy of this submission and consent to candidate application
                  data processing per the{" "}
                  <a href="/privacy" target="_blank" className="text-cyan-400 underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              {errors.consentGiven && (
                <p className="text-xs text-rose-400">{errors.consentGiven.message}</p>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button type="button" onClick={onClose} variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submitStatus === "submitting"}
                  className="gap-2"
                >
                  {submitStatus === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
