import React from "react";
import { Terminal, Smartphone, BrainCircuit, ShieldCheck, UserCheck } from "lucide-react";

export function TrustStrip() {
  const focusAreas = [
    { title: "Software Engineering", icon: Terminal, desc: "Modular, high-throughput architectures" },
    { title: "Web & Mobile", icon: Smartphone, desc: "Cross-platform mobile and responsive PWAs" },
    { title: "Artificial Intelligence", icon: BrainCircuit, desc: "Grounded RAG and enterprise workflows" },
    { title: "Technology Consulting", icon: ShieldCheck, desc: "Architecture reviews and security audits" },
    { title: "Industry Collaboration", icon: UserCheck, desc: "Senior mentorship and apprentice growth" },
  ];

  return (
    <section className="py-10 border-y border-slate-800/80 bg-slate-950/60 relative z-10" aria-label="Core Engineering Capabilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Core Disciplines & Engineering Pillars
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {focusAreas.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-3.5 rounded-xl border border-slate-850 bg-slate-900/40 hover:border-blue-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2.5">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-sm font-semibold text-slate-100">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
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
