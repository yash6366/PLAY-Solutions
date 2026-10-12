"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  GraduationCap,
  Users,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface OverviewStats {
  inquiries: {
    total: number;
    new: number;
    inProgress: number;
    contacted: number;
    closed: number;
  };
  internships: {
    total: number;
    pending: number;
    underReview: number;
    shortlisted: number;
    accepted: number;
    rejected: number;
  };
  experts: {
    total: number;
    new: number;
    underReview: number;
    contacted: number;
    active: number;
    declined: number;
  };
}

interface RecentInquiry {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, inquiriesRes] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/admin/inquiries?limit=5"),
      ]);

      if (!statsRes.ok || !inquiriesRes.ok) {
        throw new Error("Failed to load dashboard overview data");
      }

      const statsData = await statsRes.json();
      const inquiriesData = await inquiriesRes.json();

      setStats(statsData.stats);
      setRecentInquiries(inquiriesData.items || []);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    let ignore = false;
    Promise.all([
      fetch("/api/admin/overview"),
      fetch("/api/admin/inquiries?limit=5"),
    ])
      .then(async ([statsRes, inquiriesRes]) => {
        if (!statsRes.ok || !inquiriesRes.ok) {
          throw new Error("Failed to load dashboard overview data");
        }
        const statsData = await statsRes.json();
        const inquiriesData = await inquiriesRes.json();
        if (!ignore) {
          setStats(statsData.stats);
          setRecentInquiries(inquiriesData.items || []);
          setLastUpdated(new Date());
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "An unexpected error occurred");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time operational metrics across contact submissions, internship pipelines, and expert partnerships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span suppressHydrationWarning>
              {mounted ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Live Telemetry"}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="text-xs underline hover:text-white cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Inquiries Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 relative overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Contact Inquiries
              </span>
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {loading ? "..." : stats?.inquiries.total ?? 0}
              </span>
              <span className="text-xs text-slate-400">Total inquiries</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/60 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>New:</span>
                <span className="font-semibold text-cyan-400 font-mono">
                  {loading ? "..." : stats?.inquiries.new ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>In Progress:</span>
                <span className="font-semibold text-amber-400 font-mono">
                  {loading ? "..." : stats?.inquiries.inProgress ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Contacted:</span>
                <span className="font-semibold text-blue-400 font-mono">
                  {loading ? "..." : stats?.inquiries.contacted ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Closed:</span>
                <span className="font-semibold text-emerald-400 font-mono">
                  {loading ? "..." : stats?.inquiries.closed ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Manage Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Internship Applications Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 relative overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Internship Applications
              </span>
              <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {loading ? "..." : stats?.internships.total ?? 0}
              </span>
              <span className="text-xs text-slate-400">Total applicants</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/60 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Pending:</span>
                <span className="font-semibold text-cyan-400 font-mono">
                  {loading ? "..." : stats?.internships.pending ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Under Review:</span>
                <span className="font-semibold text-amber-400 font-mono">
                  {loading ? "..." : stats?.internships.underReview ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Shortlisted:</span>
                <span className="font-semibold text-blue-400 font-mono">
                  {loading ? "..." : stats?.internships.shortlisted ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Accepted:</span>
                <span className="font-semibold text-emerald-400 font-mono">
                  {loading ? "..." : stats?.internships.accepted ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <Link
              href="/admin/internships"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Review Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/careers"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Manage Postings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Expert Inquiries Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 relative overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Expert & Mentors
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {loading ? "..." : stats?.experts.total ?? 0}
              </span>
              <span className="text-xs text-slate-400">Mentor proposals</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/60 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>New:</span>
                <span className="font-semibold text-cyan-400 font-mono">
                  {loading ? "..." : stats?.experts.new ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Under Review:</span>
                <span className="font-semibold text-amber-400 font-mono">
                  {loading ? "..." : stats?.experts.underReview ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Contacted:</span>
                <span className="font-semibold text-blue-400 font-mono">
                  {loading ? "..." : stats?.experts.contacted ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Active:</span>
                <span className="font-semibold text-emerald-400 font-mono">
                  {loading ? "..." : stats?.experts.active ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <Link
              href="/admin/experts"
              className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Inspect Expert Network</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Inquiries + Security & Architecture Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries Table Preview */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Recent Inquiries
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest client submissions awaiting review
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              View All ({stats?.inquiries.total ?? 0})
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                Loading recent submissions...
              </div>
            ) : recentInquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm flex flex-col items-center">
                <FileText className="w-8 h-8 text-slate-600 mb-2" />
                <span>No inquiries received yet.</span>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">{inq.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{inq.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-300 uppercase text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {inq.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={inq.status} />
                      </td>
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Security & System Status Panel */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Security Posture
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Cryptographic JWT Sessions</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    HS256 tokens stored in strict HTTP-only, SameSite=Lax cookies with 8h lifespan.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Role-Based Access Control</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Enforced at server boundaries (SUPER_ADMIN, ADMIN, REVIEWER). Destructive actions restricted.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Audit Logging & Protection</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Logins, logouts, status modifications, and deletions recorded with actor IDs.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Crawler Exclusion</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Robots meta noindex/nofollow configured; disallowed in robots.txt.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-500 font-mono">
              Server Architecture: Next.js App Router (Turbopack) + Prisma ORM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
