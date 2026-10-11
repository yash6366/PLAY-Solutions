import React from "react";
import Link from "next/link";
import { Layers, Lock, Cpu, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

export function BusinessChallenges() {
  const challenges = [
    {
      id: "legacy-friction",
      challengeTitle: "Legacy Debt & Fragile Monoliths",
      challengeSummary:
        "Undocumented dependencies, tightly coupled modules, and outdated data stores slow down release velocity and create critical production risks.",
      solutionTitle: "Modular Refactoring & Type-Safe APIs",
      solutionSummary:
        "We decompose legacy bottlenecks into clean domain boundaries, establish strict TypeScript contracts, and build automated regression gates for zero-downtime evolution.",
      deliverable: "Modular architecture, schema migrations & test suites",
      icon: Layers,
      serviceLink: "/services/custom-software",
    },
    {
      id: "ai-privacy",
      challengeTitle: "AI Data Leakage & Unverified Output",
      challengeSummary:
        "Sending proprietary corporate filings or customer records to public cloud LLM APIs risks severe compliance violations and generative hallucinations.",
      solutionTitle: "Air-Gapped RAG & Private Inference",
      solutionSummary:
        "We engineer local vector search pipelines within customer-controlled private clouds, requiring verbatim chunk citations for every synthesized response.",
      deliverable: "Private VPC vector indexing & deterministic citation filters",
      icon: Lock,
      serviceLink: "/services/ai-integrations",
    },
    {
      id: "web-performance",
      challengeTitle: "Slow Load Times & Inaccessible Interfaces",
      challengeSummary:
        "Overly complex client bundles cause poor Core Web Vitals, high bounce rates, and inaccessible keyboard flows that exclude users.",
      solutionTitle: "Edge-Rendered Architecture & Accessible UI",
      solutionSummary:
        "We implement server-driven Next.js architectures, sub-second LCP caching, and strict semantic HTML ensuring fast, inclusive user experiences.",
      deliverable: "Sub-second Core Web Vitals & accessible keyboard navigation",
      icon: Cpu,
      serviceLink: "/services/web-applications",
    },
    {
      id: "agency-lockin",
      challengeTitle: "Proprietary Lock-In & Opaque Delivery",
      challengeSummary:
        "Traditional agencies frequently deliver black-box code, retain hidden proprietary dependencies, and filter communication through non-technical layers.",
      solutionTitle: "100% Client IP Transfer & Direct Pairing",
      solutionSummary:
        "Your business owns all source code, deployment scripts, and architectural blueprints from day one. You collaborate directly with the engineers writing the software.",
      deliverable: "Complete Git repo transfer, open toolchains & architecture runbooks",
      icon: ShieldCheck,
      serviceLink: "/about",
    },
  ];

  return (
    <section
      className="py-24 relative bg-slate-950/40 border-t border-slate-850"
      aria-labelledby="challenges-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
            Business Challenges &amp; Solutions
          </span>
          <h2
            id="challenges-heading"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Engineering Solutions for Critical Business Friction
          </h2>
          <p className="text-base text-slate-300 mt-3 leading-relaxed">
            Software should accelerate your business, not constrain it. We replace architectural
            complexity and operational risk with dependable, high-performing systems.
          </p>
        </div>

        {/* 2x2 Grid of Challenge vs Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {challenges.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-8 sm:p-9 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between hover:border-blue-500/30 transition-colors group"
              >
                <div>
                  {/* Top: The Challenge */}
                  <div className="mb-6 pb-6 border-b border-slate-850">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                        The Business Problem
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-2">
                      {item.challengeTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.challengeSummary}
                    </p>
                  </div>

                  {/* Middle: The Solution */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                        How We Engineer The Solution
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {item.solutionTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.solutionSummary}
                    </p>
                  </div>
                </div>

                {/* Bottom: Verifiable Deliverable & Link */}
                <div className="pt-6 mt-6 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px] font-medium">{item.deliverable}</span>
                  </div>
                  <Link
                    href={item.serviceLink}
                    className="text-blue-400 hover:text-white font-medium flex items-center gap-1 transition-colors self-start sm:self-auto shrink-0"
                  >
                    <span>View Capability</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
