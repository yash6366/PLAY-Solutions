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
              <Badge variant={statusVariantMap[project.status]}>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Problem Statement */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-4">
                <Terminal className="w-5 h-5 text-rose-400" />
                <h2 className="text-xl font-bold text-white">The Technical Challenge</h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {project.problemStatement}
              </p>
            </section>

            {/* Engineered Solution */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-4">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">The Architectural Solution</h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {project.solution}
              </p>
            </section>

            {/* Deliverables */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-6">
                <Layers className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Verified Deliverables & Metrics</h2>
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
