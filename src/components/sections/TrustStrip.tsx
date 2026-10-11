import React from "react";
import { ShieldCheck, FileCode2, TestTube2, Lock, Eye } from "lucide-react";

export function TrustStrip() {
  const engineeringStandards = [
    {
      title: "100% IP Ownership",
      desc: "All code and technical assets transferred to client",
      icon: FileCode2,
    },
    {
      title: "Automated Test Gates",
      desc: "Unit, integration & regression tests on every commit",
      icon: TestTube2,
    },
    {
      title: "Zero AI Data Leakage",
      desc: "Private vector search & air-gapped LLM deployments",
      icon: Lock,
    },
    {
      title: "WCAG-Guided Design",
      desc: "Semantic markup, high contrast & keyboard navigation",
      icon: Eye,
    },
    {
      title: "End-to-End Type Safety",
      desc: "Strict TypeScript contracts across client and server",
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      className="py-10 border-y border-slate-800/80 bg-slate-950/70 relative z-10"
      aria-label="Engineering Standards & Guarantees"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
            Our Engineering Operating Standards
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {engineeringStandards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-blue-500/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2.5">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 leading-tight">
                  {item.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
