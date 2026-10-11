import React from "react";
import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { coreValues, leadershipPrinciples } from "@/content/team";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Target,
  Eye,
  CheckCircle,
  Code,
  GraduationCap,
  Users,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Lock,
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

      {/* Engineering Leadership & Operating Principles */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400 block mb-2">
              Leadership Standards
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Engineering Leadership & Operating Principles
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Our team operates under strict architectural standards that govern every line of code,
              infrastructure deployment, and mentorship interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {leadershipPrinciples.map((principle, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono text-cyan-400 block mb-1">
                    {principle.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {principle.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                    Operational Standards
                  </span>
                  <ul className="space-y-2">
                    {principle.practicePoints.map((point, pIdx) => (
                      <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Quality & Security Safeguards Strip */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Accessibility (WCAG 2.2 AA)</h4>
                <p className="text-xs text-slate-300">
                  We design semantic HTML, high color contrast, visible keyboard focus indicators,
                  and screen-reader friendly web interfaces.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Data Privacy & Security</h4>
                <p className="text-xs text-slate-300">
                  Zero hardcoded secrets, CSRF and token rate-limiting on APIs, and strict input
                  normalization guarding against injection risks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Automated CI/CD Validation</h4>
                <p className="text-xs text-slate-300">
                  Every commit undergoes static type analysis, ESLint validation, and automated
                  integration test suites before deployment.
                </p>
              </div>
            </div>
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
