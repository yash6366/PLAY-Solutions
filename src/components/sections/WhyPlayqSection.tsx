import React from "react";
import Link from "next/link";
import {
  FileCheck,
  ShieldCheck,
  Lock,
  MessageSquareCode,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function WhyPlayqSection() {
  const principles = [
    {
      id: "ownership",
      title: "Transparent Ownership & Handover",
      desc: "All custom source code, infrastructure configurations, and architectural blueprints belong completely to your organization upon milestone sign-off. We provide documented runbooks with no proprietary lock-in.",
      icon: FileCheck,
      highlight: "Full repository transfer & open toolchains",
    },
    {
      id: "engineering",
      title: "Disciplined Software Engineering",
      desc: "We reject fragile abstractions. Every application is built with strict TypeScript boundaries, modular domain structures, and deterministic input validation to ensure long-term codebase health.",
      icon: ShieldCheck,
      highlight: "Strict type contracts & modular domains",
    },
    {
      id: "security",
      title: "Security-Conscious Implementation",
      desc: "We apply defense-in-depth from the start: zero hardcoded secrets, cryptographic payload verification, sliding-window rate limiting, and private cloud deployment options for sensitive AI workloads.",
      icon: Lock,
      highlight: "Zero hardcoded secrets & VPC isolation",
    },
    {
      id: "collaboration",
      title: "Direct Technical Collaboration",
      desc: "You collaborate directly with the engineers architecting and building your software. Regular sprint reviews, verifiable staging builds, and transparent technical trade-offs without opaque layers.",
      icon: MessageSquareCode,
      highlight: "Direct engineer pairing & verifiable staging",
    },
    {
      id: "quality",
      title: "Quality-Focused Delivery",
      desc: "Pull requests pass through automated static analysis, unit tests, and integration test suites before staging deployment. We verify system resilience before software reaches production.",
      icon: CheckCircle2,
      highlight: "Automated CI test gates on every commit",
    },
  ];

  return (
    <section className="py-24 bg-slate-950/60 border-t border-slate-850 relative" aria-labelledby="why-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
              Engineering Principles
            </span>
            <h2
              id="why-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Why Teams Build with PLAYQ Solutions
            </h2>
            <p className="text-base text-slate-300 mt-3 leading-relaxed">
              We combine technical craftsmanship with transparent operating standards,
              ensuring your business owns, understands, and can depend on every system we build.
            </p>
          </div>

          <Link
            href="/about"
            className="text-sm font-semibold text-blue-400 hover:text-white flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0"
          >
            <span>Learn About Our Approach</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Principles Grid: 3 in top row, 2 centered or balanced in bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-7 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-850 flex items-center gap-2 text-xs text-cyan-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}

          {principles.slice(3, 5).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-7 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 flex flex-col justify-between group transition-all md:col-span-1 lg:col-span-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-850 flex items-center gap-2 text-xs text-cyan-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Direct Discussion Invitation */}
          <div className="p-7 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-cyan-950/30 border border-blue-500/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
                Technical Scoping
              </span>
              <h3 className="text-lg font-bold text-white mb-2">
                Discuss Your Technical Requirements
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Connect directly with our engineering team to assess architecture requirements, integration complexity, and delivery feasibility.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-850">
              <Link
                href="/contact?type=business"
                className="text-xs font-semibold text-cyan-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Start Technical Scoping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
