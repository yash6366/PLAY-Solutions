import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { servicesData } from "@/content/services";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Layers,
  ShieldCheck,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicesData.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) {
    return { title: "Service Not Found" };
  }
  return {
    title: `${service.title} | Technical Service Specification`,
    description: service.overview,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="pt-28 pb-24">
      {/* Breadcrumb / Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Services</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="py-12 border-b border-slate-850 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="cyan" className="mb-4">
              {service.category} Discipline
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              {service.overview}
            </p>

            <div className="pt-6 flex flex-wrap gap-2">
              {service.technologies.map((tech, idx) => (
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
          {/* Main Body */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* Problems Addressed */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-6">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <h2 className="text-xl font-bold text-white">Challenges & Problems Addressed</h2>
              </div>
              <ul className="grid grid-cols-1 gap-3.5 text-sm text-slate-300">
                {service.problemsAddressed.map((problem, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Proposed Approach */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-6">
                <Cpu className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Our Engineering Approach</h2>
              </div>
              <ul className="grid grid-cols-1 gap-3.5 text-sm text-slate-300">
                {service.proposedApproach.map((approach, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{approach}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Typical Deliverables */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-6">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Deliverables & Artifacts</h2>
              </div>
              <ul className="grid grid-cols-1 gap-3 text-sm text-slate-300">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Engagement Process */}
            <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
              <h2 className="text-xl font-bold text-white mb-6">Engagement & Delivery Lifecycle</h2>
              <div className="flex flex-col gap-3">
                {service.engagementProcess.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 text-xs sm:text-sm text-slate-300 font-mono"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            {service.faq && service.faq.length > 0 && (
              <section className="p-8 rounded-3xl glass-panel border border-slate-800/80">
                <div className="flex items-center gap-2.5 mb-6">
                  <HelpCircle className="w-5 h-5 text-violet-400" />
                  <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
                </div>
                <div className="flex flex-col gap-6">
                  {service.faq.map((item, idx) => (
                    <div key={idx} className="border-b border-slate-850 pb-5 last:border-b-0">
                      <h3 className="text-base font-semibold text-white mb-2">
                        {item.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 p-7 rounded-3xl glass-panel border border-slate-800/80 flex flex-col gap-6">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 block mb-1">
                  Ready to Start?
                </span>
                <h3 className="text-xl font-bold text-white">
                  Discuss This Capability
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Connect with our systems architects to evaluate technical feasibility, estimate
                  sprint scope, and review architecture options.
                </p>
              </div>

              <Button
                href={`/contact?type=business&service=${service.slug}`}
                variant="primary"
                size="md"
                className="w-full justify-center gap-2"
              >
                <span>Request Technical Scoping</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="pt-4 border-t border-slate-850 text-xs text-slate-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Architecture Ownership:</span>
                  <span className="text-slate-200 font-medium">100% Client Owned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Test Coverage Target:</span>
                  <span className="text-slate-200 font-medium">Automated CI Gates</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Code Delivery:</span>
                  <span className="text-slate-200 font-medium">Strict TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
