import React from "react";
import { Compass, PenTool, Cpu, ShieldCheck, Rocket } from "lucide-react";

export function HowWeWork() {
  const steps = [
    {
      step: "01",
      title: "Deconstruct & Scope",
      desc: "We analyze technical constraints, decompose business logic, and establish measurable performance benchmarks before writing a line of code.",
      icon: Compass,
    },
    {
      title: "Architecture & Contracts",
      step: "02",
      desc: "We define explicit schema types, API contracts, data models, and component boundaries to eliminate ambiguity and integration friction.",
      icon: PenTool,
    },
    {
      step: "03",
      title: "Test-Driven Development",
      desc: "Iterative sprint delivery with strict TypeScript types, automated unit & integration test gates, and continuous code quality audits.",
      icon: Cpu,
    },
    {
      step: "04",
      title: "Security & Accessibility",
      desc: "Rigorous verification: CSRF/rate-limit checks, secret scans, WCAG 2.2 AA accessibility audits, and cross-browser regression testing.",
      icon: ShieldCheck,
    },
    {
      step: "05",
      title: "Deploy & Handover",
      desc: "Automated containerized deployment, zero-downtime cutover, telemetry monitoring, and comprehensive developer documentation handover.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative p-6 sm:p-7 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between group hover:border-blue-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
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
