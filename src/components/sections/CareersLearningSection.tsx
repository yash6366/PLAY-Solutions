import React from "react";
import { Button } from "@/components/ui/Button";
import { Code2, GitPullRequest, Users2, ArrowRight } from "lucide-react";

export function CareersLearningSection() {
  const highlights = [
    {
      title: "Real Codebases",
      description: "Write tested, modular TypeScript and backend services under active code reviews.",
      icon: Code2,
    },
    {
      title: "Senior Mentorship",
      description: "Learn software architecture, system trade-offs, and debugging from experienced developers.",
      icon: Users2,
    },
    {
      title: "CI/CD & Git Workflows",
      description: "Master pull request discipline, automated test gates, and production quality standards.",
      icon: GitPullRequest,
    },
  ];

  return (
    <section
      className="py-16 md:py-20 relative overflow-hidden border-t border-slate-850 bg-slate-950/40"
      aria-labelledby="careers-learning-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl glass-panel border border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Compact Messaging */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                Careers & Learning
              </span>

              <h2
                id="careers-learning-heading"
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              >
                Grow Your Engineering Craft
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                We offer structured apprenticeships where emerging engineers learn alongside our core team,
                contributing to open tooling, synthetic benchmarks, and demonstrative systems.
              </p>

              <div className="pt-2">
                <Button
                  href="/internships"
                  variant="outline"
                  size="md"
                  className="gap-2"
                >
                  <span>Explore Careers</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Column: 3 Clean Highlights */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex flex-col gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
