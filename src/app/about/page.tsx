import React from "react";
import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { coreValues, teamMembers } from "@/content/team";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldAlert,
  Target,
  Eye,
  CheckCircle,
  Code,
  GraduationCap,
  Users,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Engineering & Apprenticeship Philosophy",
  description: `Learn about ${brandConfig.companyName}'s mission to build resilient software while empowering the next generation of engineers through direct industry mentorship.`,
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Hero */}
      <section className="py-16 md:py-24 border-b border-slate-850 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="cyan" className="mb-4">
              Company Overview & Purpose
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Engineering Systems. Elevating Talent. Delivering Impact.
            </h1>
            <p className="text-lg text-slate-300 mt-4 leading-relaxed">
              {brandConfig.companyName} was founded on a singular conviction: that the highest
              quality software is built when seasoned engineering discipline intersects with
              the fresh, creative drive of aspiring software developers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              To provide organizations with dependable, high-velocity digital engineering solutions
              while systematically cultivating practical software craftsmanship in students and
              emerging engineers through immersive, real-world apprenticeships.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Our Vision</h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              A collaborative technology ecosystem where the artificial barrier between academic
              study and production software engineering is dissolved—fostering transparent,
              secure, and accessible digital products worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophies */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">
              Our Core Philosophies
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              The Three Pillars of Our Practice
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl glass-panel border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Code className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Technology Philosophy</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We reject unnecessary complexity and fragile abstractions. We prioritize
                strict typing, immutable state boundaries, modular architectures, and
                automated testing to ensure long-term codebase maintainability.
              </p>
            </div>

            <div className="p-7 rounded-2xl glass-panel border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Student Development</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Apprentices learn best by writing real pull requests against real specifications.
                Under mentor supervision, students navigate code reviews, continuous integration,
                and production debugging.
              </p>
            </div>

            <div className="p-7 rounded-2xl glass-panel border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Industry Collaboration</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Senior industry engineers act as force multipliers. By reviewing designs,
                delivering targeted technical workshops, and mentoring students, experts
                keep our engineering standards aligned with top-tier technology practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 block mb-2">
            Guiding Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Core Values
          </h2>
          <p className="text-base text-slate-300 mt-2">
            These values govern every engineering sprint, business agreement, and mentorship cohort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-panel border border-slate-800/80 flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3 className="text-base font-bold text-white">{val.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Founding Team Section */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-violet-400 block mb-2">
                Governance & Leadership
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Engineering Leadership
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Configured leadership directory.
              </p>
            </div>

            {/* Verification Disclaimer */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-950/40 border border-amber-600/30 text-amber-200 text-xs max-w-md">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Note: Individual public founder profiles are marked unverified in development until official regulatory disclosures are completed.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-slate-400 uppercase">
                      {member.department}
                    </span>
                    <Badge variant={member.isVerified ? "success" : "warning"}>
                      {member.isVerified ? "Verified" : "Pending Verification"}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-cyan-400 font-mono mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Focus: {member.focusArea}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button href="/contact?type=business" variant="primary" size="lg" className="gap-2">
              <span>Discuss Your Engineering Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
