import React from "react";
import { projectsData } from "@/content/projects";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, FolderSearch } from "lucide-react";

export function ProjectShowcase() {
  const publishedProjects = projectsData.filter((p) => p.published && p.isFeatured);

  return (
    <section className="py-24 bg-slate-950/70 border-t border-slate-850 relative" aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 block mb-2">
              Demonstrated Capabilities
            </span>
            <h2
              id="projects-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Architectural Systems & Live Prototypes
            </h2>
            <p className="text-base text-slate-300 mt-3 leading-relaxed">
              Explore concrete engineering implementations, telemetry platforms, and privacy-first
              AI engines built to demonstrate production architectural standards.
            </p>
          </div>

          <Button href="/projects" variant="outline" size="md" className="shrink-0 gap-2">
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {publishedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
            <FolderSearch className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Public Projects Currently Featured</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
              New project case studies and architectural prototypes are currently undergoing code review.
            </p>
            <Button href="/contact?type=business" variant="primary" size="sm">
              Inquire About Custom Development
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
