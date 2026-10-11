"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Eye,
  Trash2,
  X,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users,
  Building,
  Mail,
  Calendar,
  ExternalLink,
  Award,
  CheckCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";

interface MentorInquiry {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  roleTitle?: string | null;
  areaOfExpertise?: string;
  expertiseAreas?: string[];
  collaborationPreference?: string;
  engagementTypes?: string[];
  availability?: string | null;
  linkedInUrl?: string | null;
  linkedInOrWebsiteUrl?: string | null;
  bio?: string | null;
  message?: string;
  introduction?: string;
  status: string;
  internalNotes?: string | null;
  createdAt: string;
}

export default function AdminExpertsPage() {
  const [experts, setExperts] = useState<MentorInquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal State
  const [selectedExpert, setSelectedExpert] = useState<MentorInquiry | null>(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [editingNotes, setEditingNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Delete Modal State
  const [expertToDelete, setExpertToDelete] = useState<MentorInquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchExperts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/experts?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load expert inquiries.");
      }

      const data = await res.json();
      setExperts(data.items || []);
      setTotal(data.pagination?.total || 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading experts");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    fetch(`/api/admin/experts?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load expert inquiries.");
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          setExperts(data.items || []);
          setTotal(data.pagination?.total || 0);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading experts");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, limit, search, statusFilter]);

  const handleOpenDetail = (expert: MentorInquiry) => {
    setSelectedExpert(expert);
    setEditingStatus(expert.status);
    setEditingNotes(expert.internalNotes || "");
    setSaveSuccess(false);
  };

  const handleSaveDetails = async () => {
    if (!selectedExpert) return;
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const res = await fetch(`/api/admin/experts/${selectedExpert.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editingStatus,
          internalNotes: editingNotes,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update expert inquiry.");
      }

      const updated = await res.json();
      setSelectedExpert(
        updated.data || {
          ...selectedExpert,
          status: editingStatus,
          internalNotes: editingNotes,
        }
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      fetchExperts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!expertToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/experts/${expertToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete expert inquiry.");
      }

      setExpertToDelete(null);
      if (selectedExpert?.id === expertToDelete.id) {
        setSelectedExpert(null);
      }
      fetchExperts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting record");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Expert & Mentor Inquiries</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage industry veteran collaborations, guest lecturing, advisory, and mentorship leads.
          </p>
        </div>

        <button
          onClick={fetchExperts}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-xl transition-all disabled:opacity-50 cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by expert, company, role, or skill..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-400 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5" />
          <span>Collaboration Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-750 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CONTACTED">Contacted</option>
            <option value="ACTIVE">Active</option>
            <option value="DECLINED">Declined</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Experts Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-semibold">Expert / Affiliation</th>
                <th className="py-3 px-4 font-semibold">Specialization Areas</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Engagement Mode</th>
                <th className="py-3 px-4 font-semibold">Submitted</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
                    <span>Loading expert records...</span>
                  </td>
                </tr>
              ) : experts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No expert proposals found matching your criteria.
                  </td>
                </tr>
              ) : (
                experts.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{exp.fullName || exp.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{exp.email}</div>
                      {(exp.roleTitle || exp.organization) && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          <span>
                            {exp.roleTitle ? `${exp.roleTitle}, ` : ""}
                            {exp.organization || ""}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(exp.expertiseAreas && exp.expertiseAreas.length > 0
                          ? exp.expertiseAreas
                          : exp.areaOfExpertise
                          ? [exp.areaOfExpertise]
                          : []
                        ).map((area, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={exp.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <div className="truncate max-w-[150px]">
                        {exp.engagementTypes?.join(", ") || (exp.collaborationPreference ? exp.collaborationPreference.replace(/_/g, " ") : "General")}
                      </div>
                      <div className="text-[11px] text-slate-500">{exp.availability || "Flexible"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(exp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(exp)}
                          title="Inspect Expert Proposal"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setExpertToDelete(exp)}
                          title="Delete Proposal"
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-950 text-red-400 hover:text-red-300 border border-red-900/60 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {experts.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, total)} of {total} experts
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || loading}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expert Detail Modal */}
      {selectedExpert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Expert Collaboration Dossier
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedExpert.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedExpert(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Expert status and collaboration notes saved successfully.</span>
              </div>
            )}

            <div className="mt-6 space-y-6 text-xs">
              {/* Expert Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Expert Full Name
                  </span>
                  <div className="font-semibold text-slate-200 text-sm">{selectedExpert.name}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Email Address
                  </span>
                  <div className="flex items-center gap-2 text-slate-300 font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedExpert.email}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Affiliation & Title
                  </span>
                  <div className="text-slate-300">
                    {selectedExpert.roleTitle || "Independent"}
                    {selectedExpert.organization ? ` at ${selectedExpert.organization}` : ""}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Submission Date
                  </span>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(selectedExpert.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Engagement Preferences
                  </span>
                  <div className="text-slate-300">
                    {selectedExpert.engagementTypes?.join(", ") || "General Mentorship"} •{" "}
                    {selectedExpert.availability || "Flexible availability"}
                  </div>
                </div>
              </div>

              {/* LinkedIn & Bio */}
              {(selectedExpert.linkedInUrl || selectedExpert.linkedInOrWebsiteUrl) && (
                <div>
                  <a
                    href={selectedExpert.linkedInUrl || selectedExpert.linkedInOrWebsiteUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {selectedExpert.bio && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                    Professional Biography
                  </span>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedExpert.bio}
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                  Proposal & Collaboration Note
                </span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedExpert.message || selectedExpert.introduction || "No introduction provided."}
                </div>
              </div>

              {/* Workflow & Status Management */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label htmlFor="expert-status" className="font-semibold text-slate-200 text-xs">
                    Collaboration Status
                  </label>
                  <select
                    id="expert-status"
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="NEW">NEW</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="expert-notes" className="font-semibold text-slate-200 text-xs block mb-1.5">
                    Internal Collaboration & Honorarium Notes
                  </label>
                  <textarea
                    id="expert-notes"
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Enter curriculum alignment, compensation, or agreement details..."
                    className="w-full p-3 bg-slate-900 border border-slate-750 rounded-xl text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveDetails}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Status & Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!expertToDelete}
        title="Delete Expert Inquiry?"
        description="Are you sure you want to permanently delete this mentor/expert proposal? The record and all internal notes will be removed."
        itemName={expertToDelete ? `${expertToDelete.name} (${expertToDelete.email})` : undefined}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setExpertToDelete(null)}
      />
    </div>
  );
}
