import React from "react";
import type { Metadata } from "next";
import { projectsData } from "@/content/projects";
import { ProjectsFilterView } from "@/components/sections/ProjectsFilterView";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects & Engineering Portfolio",
  description:
    "Explore our technical case studies, live demonstrations, and architectural prototypes spanning enterprise telemetry, AI retrieval, and accessible mobile apps.",
};

export default function ProjectsPage() {
  const published = projectsData.filter((p) => p.published);

  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="py-16 border-b border-slate-850 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="cyan" className="mb-4">
              Portfolio & Engineering Showcase
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Systems Architecture & Technical Case Studies
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              We build demonstrative systems that solve concrete distributed computing, data
              ingestion, and user accessibility challenges. Every project is classified by its
              production or prototype status.
            </p>

            <div className="mt-6 flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Transparency Policy: Projects are labeled accurately as Demonstration, Prototype, or Completed. We never fabricate client statistics or testimonials.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filterable Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectsFilterView initialProjects={published} />

        <div className="mt-20 p-8 sm:p-12 rounded-3xl glass-panel border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Have a Custom System Requirement?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              We build dedicated proof-of-concepts and minimum viable products tailored to your
              exact enterprise architecture.
            </p>
          </div>
          <Button href="/contact?type=business" variant="primary" size="lg" className="shrink-0 gap-2">
            <span>Discuss a Project</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
