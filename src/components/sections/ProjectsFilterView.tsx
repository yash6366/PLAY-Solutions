"use client";

import React, { useState } from "react";
import { ProjectItem } from "@/content/projects";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { FolderSearch } from "lucide-react";

interface ProjectsFilterViewProps {
  initialProjects: ProjectItem[];
}

export function ProjectsFilterView({ initialProjects }: ProjectsFilterViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const categories = ["All", "Enterprise Software", "AI & Automation", "Web & Mobile", "Internal R&D"];
  const statuses = ["All", "Demonstration", "Prototype", "Completed", "Work in Progress"];

  const filtered = initialProjects.filter((p) => {
    const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
    const statusMatch = selectedStatus === "All" || p.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        {/* Category buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status filter dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-xs font-mono text-slate-400">
            Status:
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-950/40">
          <FolderSearch className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            No projects match the selected filter criteria
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            Try adjusting category or status filters to explore our engineering prototypes.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedStatus("All");
            }}
            className="text-xs font-mono text-cyan-400 underline hover:text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
