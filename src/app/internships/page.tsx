import React from "react";
import type { Metadata } from "next";
import { internshipOpportunities } from "@/content/internships";
import { InternshipOpportunityList } from "@/components/sections/InternshipOpportunityList";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers & Internships",
  description:
    "Explore engineering internships and career opportunities at PLAYQ Solutions. Learn alongside engineers working on practical technology projects.",
};

export default function InternshipsPage() {
  const published = internshipOpportunities.filter((o) => o.published);

  return (
    <div className="pt-28 pb-24">
      {/* Page Header */}
      <section className="py-16 border-b border-slate-850 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Careers & Internships
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              Explore internship opportunities and build production software alongside experienced
              engineers. Learn through direct mentorship, real code reviews, and practical project
              delivery.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 mt-4 font-mono">
              Review open positions below and select Apply Now to submit your application.
            </p>
          </div>
        </div>
      </section>

      {/* Main Internship Listings */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-mono uppercase text-cyan-400 block mb-1">
            Open Positions
          </span>
          <h2 className="text-2xl font-bold text-white">
            Available Internship Opportunities ({published.length})
          </h2>
        </div>

        <InternshipOpportunityList opportunities={published} />
      </section>

      {/* Secondary Section: Industry Mentorship */}
      <section
        className="py-14 border-t border-slate-850 bg-slate-950/30"
        aria-labelledby="industry-mentorship-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl glass-panel border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-wider text-violet-400 block mb-1">
                Professional Collaboration
              </span>
              <h2
                id="industry-mentorship-heading"
                className="text-2xl font-bold text-white mb-2"
              >
                Industry Mentorship
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Experienced professionals can support emerging engineers through mentorship,
                technical workshops, code reviews, and collaborative projects.
              </p>
            </div>
            <div className="shrink-0">
              <Button
                href="/experts"
                variant="outline"
                size="md"
                className="gap-2 hover:border-violet-500/40"
              >
                <span>Become a Mentor</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
