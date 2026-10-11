import React from "react";
import type { Metadata } from "next";
import { industriesData } from "@/content/industries";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Industry Solutions & Domain Architecture",
  description:
    "Tailored technological solutions across healthcare, edtech, retail, professional services, logistics, and emerging startups.",
};

export default function IndustriesPage() {
  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="py-16 border-b border-slate-850 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="cyan" className="mb-4">
              Sector Expertise & Technical Patterns
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Domain-Specific Engineering Solutions
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              Every industry operates under distinct operational constraints, data residency laws,
              and throughput profiles. We architect systems designed specifically around your
              vertical&apos;s unique challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Industry Solutions */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industriesData.map((ind) => (
            <div
              key={ind.id}
              className="p-8 rounded-3xl glass-panel border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 block mb-1">
                  Industry Vertical
                </span>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {ind.name}
                </h2>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {ind.description}
                </p>

                {/* Challenges */}
                <div className="mb-5">
                  <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider block mb-2">
                    Common Technical Hurdles:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {ind.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solutions */}
                <div className="mb-6">
                  <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
                    Engineered Solution Patterns:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {ind.solutions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Regulatory Notice (for sensitive verticals like Healthcare) */}
                {ind.complianceNotice && (
                  <div className="p-4 mb-6 rounded-2xl bg-amber-950/40 border border-amber-600/30 text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{ind.complianceNotice}</span>
                  </div>
                )}
              </div>

              {/* Technologies & CTA */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {ind.keyTechnologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Button
                  href={`/contact?type=business&industry=${ind.id}`}
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <span>Discuss Requirements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
