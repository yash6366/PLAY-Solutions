import React from "react";
import Link from "next/link";
import { industriesData } from "@/content/industries";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  Briefcase,
  Truck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function IndustriesPreview() {
  const iconMap: Record<string, React.ElementType> = {
    healthcare: HeartPulse,
    education: GraduationCap,
    "retail-commerce": ShoppingBag,
    "professional-services": Briefcase,
    logistics: Truck,
    "startups-smb": Sparkles,
  };

  return (
    <section className="py-24 relative bg-slate-950/70 border-t border-slate-850" aria-labelledby="industries-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
              Domain Expertise
            </span>
            <h2
              id="industries-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Engineered for Industry-Specific Reality
            </h2>
            <p className="text-base text-slate-300 mt-3 leading-relaxed">
              We understand that regulated healthcare, fast-paced e-commerce, and high-load telemetry
              demand specialized architectural decisions and distinct compliance considerations.
            </p>
          </div>

          <Button href="/industries" variant="outline" size="md" className="shrink-0 gap-2">
            <span>Explore All Industries</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* 6 Industry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industriesData.map((ind) => {
            const Icon = iconMap[ind.id] || Briefcase;
            return (
              <div
                key={ind.id}
                className="p-7 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between hover:border-blue-500/30 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800">
                      Domain
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-xs font-medium text-cyan-300/90 mb-3">
                    {ind.headline}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    {ind.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-4 border-t border-slate-850">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold mb-2">
                      Engineered Capabilities:
                    </span>
                    {ind.solutions.slice(0, 2).map((sol, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-850 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {ind.keyTechnologies.slice(0, 3).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/industries#${ind.id}`}
                    className="text-xs font-semibold text-blue-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
