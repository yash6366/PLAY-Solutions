"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mentorInquirySchema, MentorInquiryData } from "@/lib/validation/schemas";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

export function MentorInquiryForm() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "unconfigured"
  >("idle");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [inquiryId, setInquiryId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MentorInquiryData>({
    resolver: zodResolver(mentorInquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      areaOfExpertise: "",
      collaborationPreference: "mentor_students",
      linkedInOrWebsiteUrl: "",
      introduction: "",
      companyOfficeCode: "",
      consentGiven: true,
    },
  });

  const onSubmit = async (data: MentorInquiryData) => {
    setSubmitStatus("submitting");
    setResponseMessage("");

    try {
      const res = await fetch("/api/experts/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 201) {
        setSubmitStatus("success");
        setResponseMessage(result.message);
        setInquiryId(result.inquiryId || "");
        reset();
      } else if (res.status === 503) {
        setSubmitStatus("unconfigured");
        setResponseMessage(
          result.error ||
            "Database backend not yet connected. Set DATABASE_URL in .env to store mentor inquiries."
        );
      } else {
        setSubmitStatus("error");
        setResponseMessage(result.error || "Inquiry submission failed. Please verify the form.");
      }
    } catch {
      setSubmitStatus("error");
      setResponseMessage("Network error occurred. Please check connection and retry.");
    }
  };

  return (
    <div className="p-7 sm:p-10 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
          Express Interest in Professional Collaboration
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Share your domain background and how you would like to contribute to our ecosystem.
        </p>
      </div>

      {submitStatus === "success" && (
        <div className="p-6 mb-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <h4 className="font-bold text-white text-base">Inquiry Successfully Received</h4>
          </div>
          <p className="text-sm text-emerald-300">{responseMessage}</p>
          {inquiryId && (
            <p className="text-xs font-mono text-emerald-400/80">
              Reference: <span className="font-bold">{inquiryId}</span>
            </p>
          )}
        </div>
      )}

      {submitStatus === "unconfigured" && (
        <div className="p-4 mb-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Database Connection Notice</span>
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
        {/* Anti-spam honeypot */}
        <div className="hidden" aria-hidden="true">
          <input type="text" tabIndex={-1} {...register("companyOfficeCode")} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mentor-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="mentor-name"
              type="text"
              placeholder="e.g. Dr. Elena Vance"
              {...register("fullName")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            {errors.fullName && (
              <p className="text-xs text-rose-400 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="mentor-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Professional Email <span className="text-rose-400">*</span>
            </label>
            <input
              id="mentor-email"
              type="email"
              placeholder="elena@organization.io"
              {...register("email")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mentor-area" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Domain / Technical Expertise <span className="text-rose-400">*</span>
            </label>
            <input
              id="mentor-area"
              type="text"
              placeholder="e.g. Distributed Consensus, Cloud Security, LLM RAG"
              {...register("areaOfExpertise")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            {errors.areaOfExpertise && (
              <p className="text-xs text-rose-400 mt-1">{errors.areaOfExpertise.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="mentor-collab" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Preferred Participation Track <span className="text-rose-400">*</span>
            </label>
            <select
              id="mentor-collab"
              {...register("collaborationPreference")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="mentor_students">Student Mentorship & Code Reviews</option>
              <option value="conduct_workshop">Conduct Specialized Masterclass / Workshop</option>
              <option value="architecture_review">Independent Architecture Reviews</option>
              <option value="project_collaboration">Joint Project Development</option>
              <option value="consulting_partnership">Consulting Partnership</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="mentor-url" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
            LinkedIn / Personal Engineering URL
          </label>
          <input
            id="mentor-url"
            type="url"
            placeholder="https://linkedin.com/in/elena-vance"
            {...register("linkedInOrWebsiteUrl")}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {errors.linkedInOrWebsiteUrl && (
            <p className="text-xs text-rose-400 mt-1">{errors.linkedInOrWebsiteUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="mentor-intro" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
            Brief Introduction & Experience <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="mentor-intro"
            rows={4}
            placeholder="Tell us about your background, years in industry, and how you would like to collaborate..."
            {...register("introduction")}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y"
          />
          {errors.introduction && (
            <p className="text-xs text-rose-400 mt-1">{errors.introduction.message}</p>
          )}
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="mentor-consent"
            type="checkbox"
            {...register("consentGiven")}
            className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-cyan-400"
          />
          <label htmlFor="mentor-consent" className="text-xs text-slate-400">
            I consent to the processing of this information for mentor coordination, in accordance with
            the{" "}
            <a href="/privacy" target="_blank" className="text-cyan-400 underline">
              Privacy Policy
            </a>
            . Personal contact details will never be made public.
          </label>
        </div>
        {errors.consentGiven && (
          <p className="text-xs text-rose-400">{errors.consentGiven.message}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitStatus === "submitting"}
          className="gap-2"
        >
          {submitStatus === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Inquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Collaboration Inquiry</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
