"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormData } from "@/lib/validation/schemas";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

interface ContactFormProps {
  initialType?: "business" | "student" | "collaboration" | "general";
}

export function ContactForm({ initialType = "business" }: ContactFormProps) {
  const [selectedType, setSelectedType] = useState<ContactFormData["inquiryType"]>(initialType);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "unconfigured"
  >("idle");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [referenceId, setReferenceId] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      inquiryType: initialType,
      name: "",
      email: "",
      organization: "",
      projectCategory: "",
      budgetRange: "",
      timeline: "",
      message: "",
      companyWebsiteCheck: "",
      consentGiven: true,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("submitting");
    setResponseMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 201) {
        setSubmitStatus("success");
        setResponseMessage(result.message);
        setReferenceId(result.referenceId || "");
        reset();
        setSelectedType(initialType);
      } else if (res.status === 529 || res.status === 429) {
        setSubmitStatus("error");
        setResponseMessage(result.error || "Rate limit reached. Please wait before retrying.");
      } else if (res.status === 503) {
        setSubmitStatus("unconfigured");
        setResponseMessage(
          result.error ||
            "The database backend has not yet been connected. Set DATABASE_URL to enable live submissions."
        );
      } else {
        setSubmitStatus("error");
        setResponseMessage(result.error || "Unable to process inquiry. Please check the inputs.");
      }
    } catch {
      setSubmitStatus("error");
      setResponseMessage("Network communication failure. Please check your connection and retry.");
    }
  };

  return (
    <div className="p-7 sm:p-10 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl">
      {/* Path Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
        {[
          { id: "business", label: "Business Project" },
          { id: "student", label: "Student & Careers" },
          { id: "collaboration", label: "Industry Collaboration" },
          { id: "general", label: "General Inquiry" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setSelectedType(tab.id as ContactFormData["inquiryType"]);
              setValue("inquiryType", tab.id as ContactFormData["inquiryType"]);
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedType === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {submitStatus === "success" && (
        <div
          role="status"
          className="p-6 mb-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <h4 className="font-bold text-white text-base">Inquiry Successfully Transmitted</h4>
          </div>
          <p className="text-sm text-emerald-300">{responseMessage}</p>
          {referenceId && (
            <p className="text-xs font-mono text-emerald-400/80 mt-1">
              Tracking Reference: <span className="font-bold">{referenceId}</span>
            </p>
          )}
          <button
            type="button"
            onClick={() => setSubmitStatus("idle")}
            className="mt-3 text-xs underline text-emerald-300 hover:text-white w-fit cursor-pointer"
          >
            Send another inquiry
          </button>
        </div>
      )}

      {submitStatus === "unconfigured" && (
        <div
          role="alert"
          className="p-6 mb-8 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <h4 className="font-bold text-white text-base">Backend Configuration Notice</h4>
          </div>
          <p className="text-sm text-amber-300">{responseMessage}</p>
          <p className="text-xs text-amber-400/80">
            For development testing, set <code className="font-mono bg-black/40 px-1 py-0.5 rounded">DATABASE_URL=memory</code> or configure your managed PostgreSQL credentials in <code className="font-mono bg-black/40 px-1 py-0.5 rounded">.env</code>.
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div
          role="alert"
          className="p-4 mb-8 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-center gap-3 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{responseMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Anti-spam honeypot */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="companyWebsiteCheck">Do not fill this</label>
          <input
            id="companyWebsiteCheck"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("companyWebsiteCheck")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Your Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Alex Mercer"
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                errors.name ? "border-rose-500/80 ring-1 ring-rose-500/50" : "border-slate-800 focus:border-cyan-400"
              }`}
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-rose-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@organization.com"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                errors.email ? "border-rose-500/80 ring-1 ring-rose-500/50" : "border-slate-800 focus:border-cyan-400"
              }`}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-rose-400">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Business-specific fields */}
        {selectedType === "business" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label htmlFor="organization" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Organization / Company
              </label>
              <input
                id="organization"
                type="text"
                placeholder="Acme Corp"
                {...register("organization")}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="projectCategory" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Project Category
              </label>
              <select
                id="projectCategory"
                {...register("projectCategory")}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select Category</option>
                <option value="custom_software">Custom Software</option>
                <option value="web_mobile">Web / Mobile Application</option>
                <option value="ai_ml">AI & Machine Learning</option>
                <option value="architecture_audit">Architecture Audit & Consulting</option>
              </select>
            </div>

            <div>
              <label htmlFor="budgetRange" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Estimated Scope / Budget
              </label>
              <select
                id="budgetRange"
                {...register("budgetRange")}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select Budget</option>
                <option value="under_10k">&lt; $10k (Small Module / MVP)</option>
                <option value="10k_25k">$10k – $25k (Standard Application)</option>
                <option value="25k_50k">$25k – $50k (Complex Integration)</option>
                <option value="50k_plus">$50k+ (Enterprise Architecture)</option>
              </select>
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
            {selectedType === "business"
              ? "Project Description & Goals"
              : selectedType === "student"
              ? "Inquiry Details / Academic Background"
              : "Collaboration Proposal"} <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder={
              selectedType === "business"
                ? "Describe your product objectives, core challenges, and desired launch timeframe..."
                : "Tell us about your background, goals, or partnership ideas..."
            }
            {...register("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-y ${
              errors.message ? "border-rose-500/80 ring-1 ring-rose-500/50" : "border-slate-800 focus:border-cyan-400"
            }`}
          />
          {errors.message && (
            <p id="message-error" className="mt-1.5 text-xs text-rose-400">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Consent check */}
        <div className="flex items-start gap-3 pt-2">
          <input
            id="consentGiven"
            type="checkbox"
            {...register("consentGiven")}
            className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-cyan-400 focus:ring-offset-slate-950"
          />
          <label htmlFor="consentGiven" className="text-xs text-slate-400 leading-relaxed">
            I consent to the collection and processing of my contact information solely for the purpose
            of responding to this inquiry, in accordance with the{" "}
            <a href="/privacy" target="_blank" className="text-cyan-400 underline hover:text-white">
              Privacy Policy
            </a>
            .
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
          className="w-full sm:w-auto px-8 gap-2"
        >
          {submitStatus === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Inquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
