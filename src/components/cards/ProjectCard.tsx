import React from "react";
import Link from "next/link";
import { ProjectItem } from "@/content/projects";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: ProjectItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusVariantMap: Record<string, "success" | "cyan" | "violet" | "warning" | "secondary"> = {
    Completed: "success",
    Demonstration: "cyan",
    Prototype: "violet",
    "In Development": "warning",
    "Internal R&D": "secondary",
    "Work in Progress": "warning",
  };

  return (
    <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 group">
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
        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {project.summary}
        </p>

        {/* Problem & Solution Preview */}
        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 text-xs flex flex-col gap-2.5">
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
      </div>

      {/* Footer */}
      <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
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
          className="text-xs font-semibold text-blue-400 hover:text-white flex items-center gap-1.5 transition-colors group-hover:translate-x-0.5"
        >
          <span>View Spec</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
