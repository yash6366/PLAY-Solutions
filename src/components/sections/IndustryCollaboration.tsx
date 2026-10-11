import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, Lightbulb, Presentation, GitBranch, ArrowRight } from "lucide-react";

export function IndustryCollaboration() {
  const tracks = [
    {
      title: "Technical Mentorship",
      description: "Guide aspiring developers, review apprentice codebases, and share battle-tested software design insights.",
      icon: Users,
    },
    {
      title: "Specialized Workshops",
      description: "Deliver focused masterclasses on high-impact technologies such as distributed databases, cloud security, or LLM evaluation.",
      icon: Presentation,
    },
    {
      title: "Architecture & Code Reviews",
      description: "Provide independent peer reviews for complex client projects and startup prototypes before production launch.",
      icon: GitBranch,
    },
    {
      title: "Collaborative R&D",
      description: "Partner on open-source tools, technical research papers, and experimental tooling.",
      icon: Lightbulb,
    },
  ];

  return (
    <section className="py-24 bg-slate-950/50 border-t border-slate-850 relative" aria-labelledby="experts-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <Badge variant="violet" className="gap-1.5 py-1 px-3 mb-3">
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span>Pillar 3: Industry Expertise & Professional Collaboration</span>
          </Badge>

          <h2
            id="experts-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Industry Knowledge.{" "}
            <span className="gradient-text-accent block">
              Practical Innovation. Shared Growth.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
            We invite seasoned software engineers, engineering managers, systems architects, and
            domain researchers to collaborate within our ecosystem—sharing knowledge, guiding
            rising engineers, and solving tough technical challenges together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tracks.map((track, i) => {
            const Icon = track.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl glass-panel border border-slate-800/80 hover:border-violet-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {track.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button href="/experts" variant="primary" size="lg" className="gap-2">
            <span>Collaborate With Us</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/contact?type=collaboration" variant="outline" size="lg">
            <span>Inquire About Partnership</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
