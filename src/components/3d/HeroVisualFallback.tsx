"use client";

import React from "react";

export function HeroVisualFallback() {
  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950/80"
      aria-label="Abstract digital network visualization"
      role="img"
    >
      {/* Central glow */}
      <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute w-48 h-48 rounded-full bg-violet-500/20 blur-2xl" />

      {/* Orbit ring 1 */}
      <div className="absolute w-72 h-72 rounded-full border border-blue-400/30 border-dashed animate-[spin_40s_linear_infinite]" />

      {/* Orbit ring 2 */}
      <div className="absolute w-96 h-96 rounded-full border border-violet-400/20 animate-[spin_60s_linear_infinite_reverse]" />

      {/* Center technological core */}
      <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 p-[1px] shadow-[0_0_50px_rgba(79,140,255,0.4)]">
        <div className="w-full h-full rounded-full bg-slate-950/90 flex flex-col items-center justify-center p-3 text-center">
          <div className="w-8 h-8 rounded-full bg-cyan-400/30 flex items-center justify-center mb-1">
            <div className="w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#35D6E8]" />
          </div>
          <span className="text-[11px] font-mono text-cyan-300 font-semibold tracking-wider">
            NEXUS CORE
          </span>
          <span className="text-[9px] text-slate-400">Pillar Network</span>
        </div>
      </div>

      {/* Satellite Node 1 */}
      <div className="absolute top-1/4 left-1/4 flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-blue-500/30 backdrop-blur-sm shadow-lg">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-xs font-mono text-slate-200">Software Solutions</span>
      </div>

      {/* Satellite Node 2 */}
      <div className="absolute bottom-1/4 right-1/4 flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-violet-500/30 backdrop-blur-sm shadow-lg">
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
        <span className="text-xs font-mono text-slate-200">Student Apprentices</span>
      </div>

      {/* Satellite Node 3 */}
      <div className="absolute top-1/3 right-1/6 flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-cyan-500/30 backdrop-blur-sm shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-mono text-slate-200">Industry Mentors</span>
      </div>
    </div>
  );
}
