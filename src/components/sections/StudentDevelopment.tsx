import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  GraduationCap,
  GitPullRequest,
  Users2,
  Briefcase,
  Terminal,
  ArrowRight,
} from "lucide-react";

export function StudentDevelopment() {
  const pillars = [
    {
      title: "Real-World Software Projects",
      description: "Move beyond toy tutorial apps to author tested code inside modular microservices and full-stack web applications.",
      icon: Terminal,
    },
    {
      title: "Direct Engineering Mentorship",
      description: "Receive paired programming guidance, synchronous code reviews, and architectural advice from seasoned developers.",
      icon: Users2,
    },
    {
      title: "Rigorous Code Reviews",
      description: "Learn git workflows, branch protection rules, unit test writing, and continuous integration gatekeeping.",
      icon: GitPullRequest,
    },
    {
      title: "Portfolio Development",
      description: "Graduate with publicly demonstrable, cleanly documented open projects that prove your real engineering aptitude.",
      icon: Briefcase,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" aria-labelledby="students-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="cyan" className="gap-1.5 py-1 px-3">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pillar 2: Student Development & Industry Experience</span>
              </Badge>
            </div>

            <h2
              id="students-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight"
            >
              Learn by Building.{" "}
              <span className="gradient-text-accent block">Grow by Doing.</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Academic theory provides the foundation, but software engineering mastery requires
              grappling with real system constraints. We provide structured internships and
              project apprenticeships that bridge the gap between classroom computer science and
              production software delivery.
            </p>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 leading-relaxed">
              <span className="font-semibold text-white block mb-1">
                Transparency & Terms:
              </span>
              We clearly disclose all eligibility rules, duration limits, and compensation terms
              for every published opportunity. We never make misleading employment guarantees or
              fabricate hiring partnerships.
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button href="/internships" variant="primary" size="lg" className="gap-2">
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/about" variant="ghost" size="md">
                <span>Read Our Learning Philosophy</span>
              </Button>
            </div>
          </div>

          {/* Right Column: 4 Feature Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl glass-panel border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">
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
    </section>
  );
}
