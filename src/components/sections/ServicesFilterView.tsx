"use client";

import React, { useState } from "react";
import { ServiceDetail } from "@/content/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Search, Wrench } from "lucide-react";

interface ServicesFilterViewProps {
  services: ServiceDetail[];
}

export function ServicesFilterView({ services }: ServicesFilterViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Engineering", "Web & Mobile", "AI & Data", "Cloud & QA"];

  const filtered = services.filter((s) => {
    const matchesCategory =
      selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search and Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search technologies, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-950/40">
          <Wrench className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            No service capabilities match your query
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            Try resetting your search filter or selecting another discipline.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="text-xs font-mono text-cyan-400 underline hover:text-white cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
