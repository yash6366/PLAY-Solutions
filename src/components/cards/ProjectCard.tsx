import React from "react";
import Link from "next/link";
import { ProjectItem } from "@/content/projects";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Sparkles } from "lucide-react";

interface ProjectCardProps {
  project: ProjectItem;
  showDeepPreview?: boolean;
}

export function ProjectCard({ project, showDeepPreview = false }: ProjectCardProps) {
  const statusVariantMap: Record<string, "success" | "cyan" | "violet" | "warning" | "secondary"> = {
    Completed: "success",
    Demonstration: "cyan",
    Prototype: "violet",
    "In Development": "warning",
    "Internal R&D": "secondary",
    "Work in Progress": "warning",
  };

  const displayDescription = project.shortSummary || project.summary;

  return (
    <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 group transition-all duration-300 hover:border-cyan-500/40">
      <div className="flex flex-col gap-4">
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            {project.category}
          </span>
          <Badge variant={statusVariantMap[project.status] || "cyan"}>
            {project.status}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>

        {/* Shortened, highly readable description */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {displayDescription}
        </p>

        {/* Key Architectural Highlight */}
        {project.keyMetric && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
            <span className="font-mono text-[11px]">{project.keyMetric}</span>
          </div>
        )}

        {/* Optional Deep Preview (when explicitly requested; otherwise moved to case study) */}
        {showDeepPreview && (
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 text-xs flex flex-col gap-2.5 mt-1">
            <div>
              <span className="font-mono text-slate-400 block mb-0.5 font-semibold text-[11px]">
                Technical Problem:
              </span>
              <p className="text-slate-300 line-clamp-2 leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
            <div>
              <span className="font-mono text-cyan-400 block mb-0.5 font-semibold text-[11px]">
                Architectural Solution:
              </span>
              <p className="text-slate-300 line-clamp-2 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800"
            >
              {tech}
            </span>
          ))}
        </div>

        <Link
          href={`/projects/${project.slug}`}
          aria-label={`View case study specification for ${project.title}`}
          className="text-xs font-semibold text-cyan-400 hover:text-white flex items-center gap-1.5 transition-colors group-hover:translate-x-0.5 shrink-0"
        >
          <span>View Case Study</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
