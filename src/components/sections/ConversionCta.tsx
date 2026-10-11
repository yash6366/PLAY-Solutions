import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";

export function ConversionCta() {
  return (
    <section className="py-20 border-t border-slate-850 relative z-10" aria-label="Action Pathways">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Panel */}
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-950/60 via-slate-900/80 to-slate-950/90 border border-blue-500/30 flex flex-col justify-between overflow-hidden shadow-xl shadow-blue-950/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono mb-4 border border-blue-500/30">
                <Building2 className="w-3.5 h-3.5" />
                <span>For Organizations & Startups</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                Have a technology challenge? Let&apos;s build the right solution.
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                From high-concurrency cloud systems to specialized mobile platforms and
                enterprise AI integrations, our engineering team brings architectural discipline to
                your roadmap.
              </p>
            </div>

            <Button
              href="/contact?type=business"
              variant="primary"
              size="lg"
              className="w-fit gap-2 shadow-blue-500/30"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Student Panel */}
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-violet-950/60 via-slate-900/80 to-slate-950/90 border border-violet-500/30 flex flex-col justify-between overflow-hidden shadow-xl shadow-violet-950/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -z-10" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-mono mb-4 border border-violet-500/30">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>For Students & Aspiring Engineers</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                Ready to turn your knowledge into practical experience?
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Join our structured apprenticeship programs, learn through real code reviews and
                mentorship, and build demonstrative software that launches your engineering career.
              </p>
            </div>

            <Button
              href="/internships"
              variant="primary"
              size="lg"
              className="w-fit gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-violet-500/30"
            >
              <span>Explore Internships</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
