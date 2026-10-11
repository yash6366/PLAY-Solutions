"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brand";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, X } from "lucide-react";

export function PrelaunchBanner() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (pathname?.startsWith("/admin") || !brandConfig.isPlaceholder || dismissed) {
    return null;
  }

  const checklistItems = [
    { label: "Update brandConfig.companyName and shortName in src/config/brand.ts", done: false },
    { label: "Set official production primaryEmail and contactPhone in brand config", done: false },
    { label: "Connect managed PostgreSQL by configuring DATABASE_URL in .env", done: false },
    { label: "Verify legal privacy policy and terms before public client launch", done: false },
    { label: "Set NEXT_PUBLIC_SITE_URL to registered domain name", done: false },
  ];

  return (
    <div
      role="region"
      aria-label="Prelaunch Developer Banner"
      className="bg-amber-950/80 border-b border-amber-600/40 text-amber-200 text-xs py-2 px-4 relative z-50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold text-amber-100">
            Prelaunch Configuration Notice:
          </span>
          <span>
            Branding is currently using placeholder configuration ({brandConfig.companyName}).
          </span>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className="underline hover:text-white flex items-center gap-1 cursor-pointer"
            aria-expanded={expanded}
          >
            {expanded ? "Hide Checklist" : "View Prelaunch Checklist"}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:text-white rounded"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-amber-800/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
          {checklistItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-amber-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
