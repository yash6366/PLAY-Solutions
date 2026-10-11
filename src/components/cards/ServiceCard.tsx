import React from "react";
import Link from "next/link";
import { ServiceDetail } from "@/content/services";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ServiceCardProps {
  service: ServiceDetail;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl glass-panel glass-panel-hover h-full border border-slate-800/80">
      <div className="flex flex-col gap-4">
        {/* Category tag */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
          {service.title}
        </h3>

        {/* Short description */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {service.shortDescription}
        </p>

        {/* Capabilities list */}
        <div className="pt-2 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Key Capabilities
          </span>
          <ul className="flex flex-col gap-1.5 text-xs text-slate-300">
            {service.deliverables.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {service.technologies.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
        </div>

        <Link
          href={`/services/${service.slug}`}
          className="text-sm font-medium text-blue-400 hover:text-cyan-300 flex items-center gap-1.5 group transition-colors"
        >
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
