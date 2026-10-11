import React from "react";
import { Compass, PenTool, Cpu, Rocket } from "lucide-react";

export function HowWeWork() {
  const stages = [
    {
      step: "01",
      title: "Discover and Plan",
      desc: "We analyze technical constraints, decompose business requirements, and define clear milestone deliverables before writing code.",
      outcome: "Clear technical scope and domain architecture plan.",
      icon: Compass,
    },
    {
      step: "02",
      title: "Design and Architect",
      desc: "We establish explicit data schemas, API contracts, domain boundaries, and security perimeters to eliminate integration ambiguity.",
      outcome: "Type-safe schemas, API contracts & system specifications.",
      icon: PenTool,
    },
    {
      step: "03",
      title: "Build and Validate",
      desc: "We implement features in focused sprints backed by strict TypeScript types, automated test suites, and regular demonstration reviews.",
      outcome: "Verifiable sprint branches passing automated test gates.",
      icon: Cpu,
    },
    {
      step: "04",
      title: "Deploy and Support",
      desc: "We configure containerized environments, automate repeatable deployment pipelines, and conduct complete codebase and runbook handover.",
      outcome: "Documented deployment pipelines and full IP handover.",
      icon: Rocket,
    },
  ];

  return (
    <section className="py-24 relative" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
            Delivery Lifecycle
          </span>
          <h2
            id="process-heading"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            How We Deliver Software
          </h2>
          <p className="text-base text-slate-300 mt-3 leading-relaxed">
            A disciplined, milestone-driven framework that guarantees architectural clarity,
            verifiable progress, and complete code ownership for your team.
          </p>
        </div>

        {/* 4 Clear Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-7 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-850">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                    Stage Outcome:
                  </span>
                  <p className="text-xs text-cyan-300/90 leading-normal">
                    {item.outcome}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
