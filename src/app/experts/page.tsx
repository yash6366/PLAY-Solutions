import React from "react";
import type { Metadata } from "next";
import { MentorInquiryForm } from "@/components/forms/MentorInquiryForm";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Presentation,
  GitPullRequest,
  Lightbulb,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Industry Experts & Technical Mentorship Network",
  description:
    "Join our ecosystem of senior software architects, engineering leaders, and domain experts. Guide students, lead technical masterclasses, and review systems architectures.",
};

export default function ExpertsPage() {
  const tracks = [
    {
      title: "Student Mentorship & Code Reviews",
      description:
        "Meet periodically with assigned engineering interns, review open pull requests, discuss design patterns, and provide constructive feedback.",
      icon: Users,
    },
    {
      title: "Specialized Technical Workshops",
      description:
        "Deliver interactive masterclasses on niche topics—such as distributed consensus, vector search architectures, cloud security, or Kubernetes scaling.",
      icon: Presentation,
    },
    {
      title: "Independent Architecture Audits",
      description:
        "Participate in high-level architectural reviews of startup prototypes and client systems, identifying technical debt and vulnerability surfaces.",
      icon: GitPullRequest,
    },
    {
      title: "Collaborative R&D & Open Tooling",
      description:
        "Partner with our engineers on open-source frameworks, benchmark studies, and developer tooling.",
      icon: Lightbulb,
    },
  ];

  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="py-16 border-b border-slate-850 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="violet" className="mb-4">
              Pillar 3: Industry Expertise & Professional Collaboration
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Share Knowledge. Guide Tomorrow&apos;s Engineers.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              We connect senior technologists with motivated emerging engineers. Whether you have
              an hour a month to review code or want to deliver a deep-dive workshop, our structured
              collaboration tracks are designed for high-impact participation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Form */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Tracks & Standards */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-mono uppercase text-violet-400 block mb-1">
                Engagement Pathways
              </span>
              <h2 className="text-2xl font-bold text-white mb-4">
                How You Can Participate
              </h2>
            </div>

            <div className="space-y-4">
              {tracks.map((track, i) => {
                const Icon = track.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl glass-panel border border-slate-800/80 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {track.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Privacy & Discretion Assured</span>
              </div>
              <p className="leading-relaxed">
                Personal contact details submitted through this form are kept strictly confidential
                and will never be publicly indexed or distributed. Public mentor profiles require
                formal mutual authorization.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <MentorInquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}
