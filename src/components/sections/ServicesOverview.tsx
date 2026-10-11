import React from "react";
import Link from "next/link";
import { servicesData } from "@/content/services";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Cpu,
  Cloud,
  Network,
  TestTube2,
} from "lucide-react";

export function ServicesOverview() {
  const coreServices = [
    {
      slug: "custom-software",
      icon: Code2,
      categoryLabel: "Custom Software",
      accentColor: "blue",
    },
    {
      slug: "web-applications",
      icon: Smartphone,
      categoryLabel: "Web & Mobile",
      accentColor: "cyan",
    },
    {
      slug: "ai-integrations",
      icon: Cpu,
      categoryLabel: "AI & Automation",
      accentColor: "indigo",
    },
    {
      slug: "cloud-applications",
      icon: Cloud,
      categoryLabel: "Cloud & DevOps",
      accentColor: "sky",
    },
    {
      slug: "api-development",
      icon: Network,
      categoryLabel: "APIs & Integration",
      accentColor: "emerald",
    },
    {
      slug: "software-testing",
      icon: TestTube2,
      categoryLabel: "Quality Engineering",
      accentColor: "teal",
    },
  ].map((item) => {
    const data = servicesData.find((s) => s.slug === item.slug);
    return {
      ...item,
      title: data?.title || item.categoryLabel,
      shortDescription: data?.shortDescription || "",
      technologies: data?.technologies.slice(0, 3) || [],
    };
  });

  return (
    <section className="py-24 relative" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
              Core Capabilities
            </span>
            <h2
              id="services-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Engineered for Practical Business Impact
            </h2>
            <p className="text-base text-slate-300 mt-3 leading-relaxed">
              We eliminate technical bottlenecks and modernize software systems through disciplined
              architecture, type-safe implementations, and transparent delivery milestones.
            </p>
          </div>

          <Button href="/services" variant="outline" size="md" className="shrink-0 gap-2">
            <span>Explore All 14 Services</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Unified 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.slug}
                className="p-7 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800">
                      {service.categoryLabel}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors">
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {service.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-semibold text-blue-400 hover:text-white flex items-center gap-1 transition-colors group-hover:translate-x-0.5"
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
