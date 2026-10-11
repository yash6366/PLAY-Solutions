"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brand";
import { footerNav } from "@/config/navigation";
import { Mail, Phone, MapPin, Layers, ExternalLink } from "lucide-react";

function getYearSnapshot() {
  return new Date().getFullYear();
}

function subscribeYear() {
  return () => {};
}

export function Footer() {
  const pathname = usePathname();
  const currentYear = React.useSyncExternalStore(subscribeYear, getYearSnapshot, () => 2026);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-800/80 bg-[#080B14] relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-850">
          {/* Column 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#080B14] rounded-[7px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {brandConfig.companyName}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {brandConfig.description}
            </p>

            <div className="flex flex-col gap-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${brandConfig.primaryEmail}`}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {brandConfig.primaryEmail}
                </a>
              </div>
              {brandConfig.contactPhone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>{brandConfig.contactPhone}</span>
                </div>
              )}
              {brandConfig.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{brandConfig.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Solutions */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
              Technology Solutions
            </span>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              {footerNav.solutions.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Ecosystem & Pillars */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
              Ecosystem & Careers
            </span>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              {footerNav.ecosystem.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Legal & Transparency */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
              Legal & Compliance
            </span>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              {footerNav.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links (only displayed when configured) */}
            <div className="pt-3">
              <span className="text-xs text-slate-400 font-mono uppercase block mb-2">
                Verified Socials
              </span>
              <div className="flex items-center gap-3">
                {brandConfig.socialLinks.linkedin && (
                  <a
                    href={brandConfig.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {brandConfig.socialLinks.github && (
                  <a
                    href={brandConfig.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    aria-label="GitHub organization"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {currentYear} {brandConfig.companyName}. All rights reserved.
          </p>
          <p className="text-slate-400 text-center sm:text-right">
            Engineered for high-reliability systems and practical learning.
          </p>
        </div>
      </div>
    </footer>
  );
}
