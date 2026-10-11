import React from "react";
import { ShieldCheck, FileCheck, Lock, Eye, MessageSquareCode, CheckCircle2 } from "lucide-react";

export function CompanyPrinciples() {
  const principles = [
    {
      title: "Systems Craftsmanship & Strict Types",
      desc: "We reject fragile abstractions. Every application is built with strict TypeScript boundaries, modular domains, and automated regression test suites.",
      icon: ShieldCheck,
      details: ["Strict compile-time checking", "Automated Vitest/CI gates", "Documented REST & DB schemas"],
    },
    {
      title: "Full Code & IP Ownership",
      desc: "All source code, infrastructure configurations, and architectural blueprints belong 100% to your business upon milestone delivery. No proprietary lock-in.",
      icon: FileCheck,
      details: ["Client repository ownership", "Standard open-source toolchains", "Clear handover documentation"],
    },
    {
      title: "Private AI & Data Responsibility",
      desc: "We implement Retrieval-Augmented Generation (RAG) and private model inference within customer-controlled VPCs. Your data is never leaked or used for external model training.",
      icon: Lock,
      details: ["Air-gapped vector pipelines", "Zero third-party training leakage", "Deterministic source citations"],
    },
    {
      title: "Universal Accessibility & Standards",
      desc: "We engineer semantic HTML, high contrast ratios, visible keyboard focus indicators, and screen-reader compliant flows aligned with WCAG benchmarks.",
      icon: Eye,
      details: ["Full keyboard navigability", "Screen-reader semantic trees", "Automated axe accessibility audits"],
    },
    {
      title: "Transparent, Direct Communication",
      desc: "You collaborate directly with the engineers architecting your software. Bi-weekly demos, verifiable sprint branches, and zero opaque agency layers.",
      icon: MessageSquareCode,
      details: ["Direct engineer communication", "Bi-weekly milestone demos", "Verifiable staging builds"],
    },
  ];

  return (
    <section className="py-24 bg-slate-950/60 border-t border-slate-850 relative" aria-labelledby="principles-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold block mb-2">
            Engineering Principles
          </span>
          <h2
            id="principles-heading"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            How We Build Responsible, Dependable Software
          </h2>
          <p className="text-base text-slate-300 mt-3 leading-relaxed">
            Our engineering practices are guided by strict quality standards, data privacy,
            and complete intellectual transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between group hover:border-blue-500/30 transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-850 space-y-1.5">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
