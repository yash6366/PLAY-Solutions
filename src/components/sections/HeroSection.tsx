import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/components/3d/HeroVisual";
import { ArrowRight, Code2, ShieldCheck, Cpu } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] radial-glow-blue -z-10 pointer-events-none opacity-80" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] radial-glow-cyan -z-10 pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Positioning & Call to Action */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 shadow-sm shadow-cyan-950/50">
                Software Engineering &amp; Digital Solutions
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Build the technology that{" "}
              <span className="gradient-text-accent block mt-1.5">
                moves your business forward.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              PLAYQ Solutions designs and develops custom software, web and mobile
              applications, and intelligent automation that help businesses solve complex
              operational challenges and turn ideas into dependable digital products.
            </p>

            {/* Clear Primary and Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Button href="/contact?type=business" variant="primary" size="lg" className="gap-2 shadow-lg shadow-blue-600/20">
                <span>Discuss Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Link
                href="/projects"
                className="text-sm font-semibold text-slate-300 hover:text-white px-2 py-2 transition-colors flex items-center gap-1.5 underline-offset-4 hover:underline"
              >
                <span>Explore Our Work</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Authentic Engineering Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="font-medium">Engineering-Led Delivery</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="font-medium">Transparent Ownership</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="font-medium">Quality-Focused CI Gates</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Animated Hero Visual */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
