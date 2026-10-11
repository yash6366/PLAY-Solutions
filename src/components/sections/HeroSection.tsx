import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HeroVisual } from "@/components/3d/HeroVisual";
import { ArrowRight, Code, Sparkles, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="cyan" className="gap-1.5 py-1 px-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Generation Technology & Apprenticeship</span>
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Build Better Digital Products.{" "}
              <span className="gradient-text-accent block mt-1">
                Engineer for What Comes Next.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              PLAYQ Solutions helps businesses turn complex challenges into dependable digital
              products through custom software engineering, web and mobile development, AI
              integration, and cloud solutions. We combine practical engineering with thoughtful
              design to build technology that can evolve with your business.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button href="/contact?type=business" variant="primary" size="lg" className="gap-2">
                <span>Discuss Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button href="/projects" variant="secondary" size="lg">
                <span>Explore Our Work</span>
              </Button>

              <Link
                href="/internships"
                className="text-sm font-medium text-slate-400 hover:text-cyan-300 px-3 py-2 transition-colors flex items-center gap-1.5"
              >
                <span>Student Internships</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>

            {/* Three Pillar Summary Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Code className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span>Custom Software Engineering</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span>Student Apprenticeship</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <span>Industry Mentorship</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Visualization */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
