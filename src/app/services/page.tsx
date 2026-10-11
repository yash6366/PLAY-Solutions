import React from "react";
import type { Metadata } from "next";
import { servicesData } from "@/content/services";
import { ServicesFilterView } from "@/components/sections/ServicesFilterView";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Technology Solutions & Engineering Catalog",
  description:
    "Explore our complete service offerings: custom software, web applications, cross-platform mobile, AI integration, database engineering, and architecture consulting.",
};

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="py-16 border-b border-slate-850 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 inline-block mb-4">
              Core Engineering Disciplines
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Comprehensive Engineering & Development Services
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              We design, build, test, and maintain digital products and cloud systems. Every service
              is delivered with strict architectural standards, type-safety, and automated test
              coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Filterable Services Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServicesFilterView services={servicesData} />

        {/* Custom Scope CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl glass-panel border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
              <Wrench className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Require a Custom Architecture or Legacy Modernization?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We frequently architect bespoke solutions tailored to proprietary hardware, private
              on-premises databases, and specialized enterprise protocols.
            </p>
          </div>

          <Button href="/contact?type=business" variant="primary" size="lg" className="shrink-0 gap-2">
            <span>Schedule Architectural Scoping</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
