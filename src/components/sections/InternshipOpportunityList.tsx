"use client";

import React, { useState } from "react";
import { InternshipOpportunity } from "@/content/internships";
import { InternshipApplyModal } from "@/components/forms/InternshipApplyModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  MapPin,
  Coins,
  CheckCircle2,
  Calendar,
  Users,
  Send,
} from "lucide-react";

interface InternshipOpportunityListProps {
  opportunities: InternshipOpportunity[];
}

export function InternshipOpportunityList({
  opportunities,
}: InternshipOpportunityListProps) {
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<InternshipOpportunity | null>(null);

  return (
    <div className="space-y-8">
      {opportunities.map((opp) => (
        <div
          key={opp.id}
          className="p-7 sm:p-9 rounded-3xl glass-panel border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
        >
          <div>
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-cyan-400">
                  {opp.department}
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-xs text-slate-400 font-mono">
                  {opp.type}
                </span>
              </div>
              <Badge variant="cyan">Open for Application</Badge>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {opp.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              {opp.description}
            </p>

            {/* Opportunity Metadata Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Duration: {opp.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Mode: {opp.locationMode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-violet-400 shrink-0" />
                <span className="truncate">{opp.compensationStatus}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deadline: {opp.deadline}</span>
              </div>
            </div>

            {/* Eligibility & Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                  Required Core Qualifications:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {opp.requiredSkills.map((skill, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                  Eligibility & Candidate Profile:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                  {opp.eligibility}
                </p>
                <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Available Positions: {opp.availablePositions}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-mono">
              Selection based on technical evaluation & code review task.
            </span>

            <Button
              onClick={() => setSelectedOpportunity(opp)}
              variant="primary"
              size="md"
              className="gap-2 shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Apply for this Position</span>
            </Button>
          </div>
        </div>
      ))}

      {/* Application Modal */}
      {selectedOpportunity && (
        <InternshipApplyModal
          opportunity={selectedOpportunity}
          isOpen={Boolean(selectedOpportunity)}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </div>
  );
}
