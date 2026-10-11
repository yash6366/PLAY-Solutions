import React from "react";
import { Compass, PenTool, Cpu, Rocket } from "lucide-react";

export function HowWeWork() {
  const steps = [
    {
      step: "01",
      title: "Discover",
      desc: "We analyze technical constraints, decompose business logic, and establish measurable performance benchmarks before writing a line of code.",
      icon: Compass,
    },
    {
      step: "02",
      title: "Design",
      desc: "Architectural modeling, API contract specifications, database schemas, and interactive UI prototypes with strict accessibility checks.",
      icon: PenTool,
    },
    {
      step: "03",
      title: "Develop",
      desc: "Iterative sprint delivery with strict TypeScript types, automated unit & integration test gates, and continuous code quality audits.",
      icon: Cpu,
    },
    {
      step: "04",
      title: "Deliver",
      desc: "Automated containerized deployment, zero-downtime cutover, telemetry monitoring, and comprehensive developer documentation handover.",
      icon: Rocket,
    },
  ];

  return (
    <section className="py-24 relative" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">
            Engineering Methodology
          </span>
          <h2
            id="process-heading"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            How We Work
          </h2>
          <p className="text-base text-slate-300 mt-3 leading-relaxed">
            A disciplined, four-phase delivery framework that ensures technical predictability,
            verifiable progress, and high architectural standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative p-7 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between group hover:border-blue-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black font-mono text-slate-700 group-hover:text-cyan-400/50 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
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
