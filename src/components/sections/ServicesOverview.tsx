import React from "react";
import { servicesData } from "@/content/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function ServicesOverview() {
  const featuredServices = servicesData.filter((s) => s.isFeaturedHomepage);

  return (
    <section className="py-24 relative" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">
              Pillar 1: Technology Solutions
            </span>
            <h2
              id="services-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Engineered for Precision, Speed, and Scale
            </h2>
            <p className="text-base text-slate-300 mt-3 leading-relaxed">
              We help organizations modernize legacy code, build resilient digital products, and
              integrate practical AI architectures that eliminate operational bottlenecks.
            </p>
          </div>

          <Button href="/services" variant="outline" size="md" className="shrink-0 gap-2">
            <span>View Full Service Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
