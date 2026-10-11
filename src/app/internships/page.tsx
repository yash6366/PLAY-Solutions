import React from "react";
import type { Metadata } from "next";
import { internshipOpportunities } from "@/content/internships";
import { InternshipOpportunityList } from "@/components/sections/InternshipOpportunityList";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Student Internships & Technical Apprenticeships",
  description:
    "Explore our industry-oriented software engineering internships and apprenticeships. Learn by building real systems under direct mentor guidance.",
};

export default function InternshipsPage() {
  const published = internshipOpportunities.filter((o) => o.published);

  return (
    <div className="pt-28 pb-24">
      {/* Hero */}
      <section className="py-16 border-b border-slate-850 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="cyan" className="mb-4">
              Pillar 2: Student Development & Industry Experience
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Software Engineering Internships & Apprenticeships
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              Bridge the divide between academic computer science and professional software
              engineering. Author tested code, navigate real code reviews, and ship features under
              hands-on mentorship.
            </p>

            {/* Ethical Terms Notice */}
            <div className="mt-6 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-3 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">
                  Transparent Terms & Eligibility:
                </span>
                We clearly disclose all opportunity terms, duration, and compensation status below.
                We do not make misleading guarantees of employment, certificates without merit, or
                unverified placement partnerships.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
            Active Cohorts
          </span>
          <h2 className="text-2xl font-bold text-white">
            Available Technical Positions ({published.length})
          </h2>
        </div>

        <InternshipOpportunityList opportunities={published} />
      </section>
    </div>
  );
}
