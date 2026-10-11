import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, Clock, FileCode2 } from "lucide-react";

export function ConversionCta() {
  return (
    <section className="py-20 border-t border-slate-850 relative z-10" aria-label="Discuss a Project">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 sm:p-14 rounded-3xl glass-panel border border-slate-800/90 overflow-hidden text-center max-w-4xl mx-auto shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] radial-glow-blue pointer-events-none -z-10" />

          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 inline-block mb-4">
            Start a Conversation
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Have a Software Challenge?{" "}
            <span className="gradient-text-accent block sm:inline">
              Let&apos;s Build the Solution.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
            Whether you need a scalable web application, mobile native platform, high-throughput
            APIs, or private AI automation, we bring architectural clarity and disciplined execution
            to your roadmap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button
              href="/contact?type=business"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <span>Discuss a Project</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              href="/services"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <span>Explore All Capabilities</span>
            </Button>
          </div>

          {/* Practical Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-850 text-xs text-slate-400 text-left">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Response within 1–2 business days</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FileCode2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>100% Client Code & IP Ownership</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Non-Disclosure & Confidentiality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
