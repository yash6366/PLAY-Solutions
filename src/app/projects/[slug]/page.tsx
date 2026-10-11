import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projectsData } from "@/content/projects";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  Target,
  ShieldCheck,
  Activity,
  AlertCircle,
  ExternalLink,
  Sparkles,
  GitBranch,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Case Study Specification`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const statusVariantMap = {
    Completed: "success" as const,
    Demonstration: "cyan" as const,
    Prototype: "violet" as const,
    "In Development": "warning" as const,
    "Internal R&D": "secondary" as const,
    "Work in Progress": "warning" as const,
  };

  return (
    <div className="pt-28 pb-24">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Header */}
      <section className="py-12 border-b border-slate-850 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-slate-400">
                {project.category}
              </span>
              <Badge variant={statusVariantMap[project.status] || "cyan"}>
                {project.status}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              {project.summary}
            </p>

            <div className="pt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* The Technical Challenge */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-4">
                <Terminal className="w-5 h-5 text-rose-400" />
                <h2 className="text-xl font-bold text-white">The Technical Challenge</h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {project.problemStatement}
              </p>
            </section>

            {/* Engineering Objectives */}
            {project.objectives && project.objectives.length > 0 && (
              <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-6">
                  <Target className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-white">Engineering Objectives</h2>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  {project.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* The Architectural Solution */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-4">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">The Architectural Solution</h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {project.solution}
              </p>

              {project.architectureOverview && (
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="font-mono text-cyan-300 font-semibold block mb-2">
                    System Architecture Breakdown:
                  </span>
                  <p>{project.architectureOverview}</p>
                </div>
              )}
            </section>

            {/* Key Features */}
            {project.importantFeatures && project.importantFeatures.length > 0 && (
              <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-6">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <h2 className="text-xl font-bold text-white">Key Capabilities & Features</h2>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
                  {project.importantFeatures.map((feat, idx) => (
                    <li
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Deliverables */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-6">
                <Layers className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Verified Deliverables & Artifacts</h2>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                {project.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Security & Reliability Considerations */}
            {project.securityAndReliability && project.securityAndReliability.length > 0 && (
              <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-6">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Security & Reliability Safeguards</h2>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  {project.securityAndReliability.map((sec, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{sec}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Testing Methodology */}
            {project.testingMethodology && project.testingMethodology.length > 0 && (
              <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-6">
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">Testing Methodology & QA Gates</h2>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  {project.testingMethodology.map((test, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Verified Performance Measurements */}
            {project.verifiedMeasurements && project.verifiedMeasurements.length > 0 && (
              <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-6">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Verified Performance Observations</h2>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  {project.verifiedMeasurements.map((meas, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      <span>{meas}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Known Limitations & Scope Boundaries */}
            {project.knownLimitations && project.knownLimitations.length > 0 && (
              <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-4">
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                  <h2 className="text-xl font-bold text-white">Known Limitations & Scope Transparency</h2>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  To preserve architectural honesty, we clearly disclose the current operational bounds of this implementation:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {project.knownLimitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 p-7 rounded-3xl glass-panel border border-slate-800/80 flex flex-col gap-6">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 block mb-1">
                  Architecture Review
                </span>
                <h3 className="text-xl font-bold text-white">
                  Build a Similar System
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Need a tailored software architecture with equivalent telemetry, RAG, or
                  high-concurrency capabilities? Let&apos;s evaluate your requirements.
                </p>
              </div>

              <Button
                href={`/contact?type=business&project=${project.slug}`}
                variant="primary"
                size="md"
                className="w-full justify-center gap-2"
              >
                <span>Discuss System Scope</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Related Services */}
              {project.relatedServices && project.relatedServices.length > 0 && (
                <div className="pt-4 border-t border-slate-850">
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-3">
                    Related Service Offerings
                  </span>
                  <div className="flex flex-col gap-2">
                    {project.relatedServices.map((rel, idx) => (
                      <Link
                        key={idx}
                        href={`/services/${rel.slug}`}
                        className="text-xs text-slate-300 hover:text-cyan-300 flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 transition-colors"
                      >
                        <span>{rel.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-850 text-xs text-slate-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Architecture Status:</span>
                  <Badge variant={statusVariantMap[project.status] || "cyan"} className="text-[10px] py-0">
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Code Ownership:</span>
                  <span className="text-slate-200 font-medium">Full Client IP Ownership</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Model:</span>
                  <span className="text-slate-200 font-medium">Sprints & CI Gates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
