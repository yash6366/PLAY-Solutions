import React from "react";
import Link from "next/link";
import { servicesData } from "@/content/services";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from "lucide-react";

export function ServicesOverview() {
  const customSoftware = servicesData.find((s) => s.slug === "custom-software");
  const webMobile = servicesData.find((s) => s.slug === "web-applications");
  const aiAutomation = servicesData.find((s) => s.slug === "ai-integrations");
  const cloudDevOps = servicesData.find((s) => s.slug === "cloud-applications");
  const consulting = servicesData.find((s) => s.slug === "tech-consulting");

  return (
    <section className="py-24 relative" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
              Business Capabilities
            </span>
            <h2
              id="services-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Engineered for Practical Business Impact
            </h2>
            <p className="text-base text-slate-300 mt-3 leading-relaxed">
              We eliminate technical bottlenecks and modernize software systems through disciplined
              engineering, type-safe architectures, and transparent delivery milestones.
            </p>
          </div>

          <Button href="/services" variant="outline" size="md" className="shrink-0 gap-2">
            <span>Explore All 14 Services</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Primary Row: 2 Major Pillars (Custom Software & Web/Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Custom Software */}
          {customSoftware && (
            <div className="p-8 sm:p-10 rounded-2xl glass-panel border border-slate-800/90 flex flex-col justify-between group hover:border-blue-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-blue-300 bg-blue-950/50 border border-blue-800/40 px-3 py-1 rounded-full">
                    Custom Software Engineering
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {customSoftware.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {customSoftware.shortDescription}
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-850">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                    Core Deliverables & Standards:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                    {customSoftware.deliverables.slice(0, 4).map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-850 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {customSoftware.technologies.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/services/${customSoftware.slug}`}
                  className="text-sm font-medium text-blue-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Web & Mobile Applications */}
          {webMobile && (
            <div className="p-8 sm:p-10 rounded-2xl glass-panel border border-slate-800/90 flex flex-col justify-between group hover:border-cyan-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 bg-cyan-950/50 border border-cyan-800/40 px-3 py-1 rounded-full">
                    Web & Mobile Development
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {webMobile.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {webMobile.shortDescription}
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-850">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                    Core Deliverables & Standards:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                    {webMobile.deliverables.slice(0, 4).map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-850 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {webMobile.technologies.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/services/${webMobile.slug}`}
                  className="text-sm font-medium text-cyan-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Secondary Row: 3 Specialized Pillars (AI, Cloud/DevOps, Tech Consulting) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI & Intelligent Automation */}
          {aiAutomation && (
            <div className="p-7 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between group hover:border-indigo-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider">
                    AI & Automation
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {aiAutomation.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {aiAutomation.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Zero data leakage</span>
                <Link
                  href={`/services/${aiAutomation.slug}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Cloud & DevOps */}
          {cloudDevOps && (
            <div className="p-7 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between group hover:border-blue-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-mono text-blue-300 uppercase tracking-wider">
                    Cloud & Quality
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {cloudDevOps.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {cloudDevOps.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">CI/CD & Telemetry</span>
                <Link
                  href={`/services/${cloudDevOps.slug}`}
                  className="text-xs font-semibold text-blue-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Technology Consulting */}
          {consulting && (
            <div className="p-7 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between group hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider">
                    Advisory & Audits
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {consulting.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {consulting.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Architecture Reviews</span>
                <Link
                  href={`/services/${consulting.slug}`}
                  className="text-xs font-semibold text-emerald-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
