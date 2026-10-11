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
  MessageSquare,
  Building,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Download,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  type?: string;
  inquiryType?: string;
  serviceId?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  message: string;
  status: string;
  internalNotes?: string | null;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [editingNotes, setEditingNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Delete Modal State
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (typeFilter !== "ALL") params.set("type", typeFilter);

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load inquiries.");
      }

      const data = await res.json();
      setInquiries(data.items || []);
      setTotal(data.pagination?.total || 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading inquiries");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, typeFilter]);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (typeFilter !== "ALL") params.set("type", typeFilter);

    fetch(`/api/admin/inquiries?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load inquiries.");
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          setInquiries(data.items || []);
          setTotal(data.pagination?.total || 0);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading inquiries");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, limit, search, statusFilter, typeFilter]);

  const handleOpenDetail = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setEditingStatus(inquiry.status);
    setEditingNotes(inquiry.internalNotes || "");
    setSaveSuccess(false);
  };

  const handleSaveDetails = async () => {
    if (!selectedInquiry) return;
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editingStatus,
          internalNotes: editingNotes,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update inquiry.");
      }

      const updated = await res.json();
      setSelectedInquiry(
        updated.data || {
          ...selectedInquiry,
          status: editingStatus,
          internalNotes: editingNotes,
        }
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Refresh list
      fetchInquiries();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/inquiries/${inquiryToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete inquiry.");
      }

      setInquiryToDelete(null);
      if (selectedInquiry?.id === inquiryToDelete.id) {
        setSelectedInquiry(null);
      }
      fetchInquiries();
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
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            <span>Contact Inquiries</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review and triage inbound general and client service inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/api/admin/inquiries/export?search=${encodeURIComponent(search)}&status=${statusFilter}&type=${typeFilter}`}
            download
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/60 rounded-xl transition-all cursor-pointer w-fit"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-xl transition-all disabled:opacity-50 cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
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
            placeholder="Search by name, email, or company..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-750 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-750 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Types</option>
              <option value="GENERAL">General</option>
              <option value="SERVICE">Service</option>
              <option value="PROJECT">Project</option>
              <option value="PARTNERSHIP">Partnership</option>
            </select>
          </div>
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

      {/* Inquiries Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-semibold">Contact / Organization</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Timeline & Budget</th>
                <th className="py-3 px-4 font-semibold">Received</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                    <span>Loading inquiry records...</span>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No inquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{inq.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{inq.email}</div>
                      {inq.organization && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          <span>{inq.organization}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {inq.type || inq.inquiryType || "GENERAL"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={inq.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <div>{inq.timeline || "—"}</div>
                      <div className="text-[11px] text-slate-500">{inq.budgetRange || "—"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(inq)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setInquiryToDelete(inq)}
                          title="Delete Record"
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
            Showing {inquiries.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, total)} of {total} inquiries
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

      {/* Detail & Status Modal */}
      {selectedInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-cyan-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Inquiry Details
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedInquiry.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Inquiry status and internal notes saved successfully.</span>
              </div>
            )}

            <div className="mt-6 space-y-6 text-xs">
              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Client Name
                  </span>
                  <div className="font-semibold text-slate-200 text-sm">{selectedInquiry.name}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Email Address
                  </span>
                  <div className="flex items-center gap-2 text-slate-300 font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedInquiry.email}</span>
                  </div>
                </div>

                {selectedInquiry.phone && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      Phone Number
                    </span>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedInquiry.phone}</span>
                    </div>
                  </div>
                )}

                {selectedInquiry.organization && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      Organization
                    </span>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedInquiry.organization}</span>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Submission Date
                  </span>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Budget & Timeline
                  </span>
                  <div className="text-slate-300">
                    {selectedInquiry.budgetRange || "No budget specified"} •{" "}
                    {selectedInquiry.timeline || "Flexible"}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                  Client Message
                </span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Workflow & Status Management */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label htmlFor="edit-status" className="font-semibold text-slate-200 text-xs">
                    Workflow Status
                  </label>
                  <select
                    id="edit-status"
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_REVIEW">IN_REVIEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-notes" className="font-semibold text-slate-200 text-xs block mb-1.5">
                    Internal Staff Notes (Restricted)
                  </label>
                  <textarea
                    id="edit-notes"
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Enter confidential notes, lead qualification, or staff assignment..."
                    className="w-full p-3 bg-slate-900 border border-slate-750 rounded-xl text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveDetails}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
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
        isOpen={!!inquiryToDelete}
        title="Delete Contact Inquiry?"
        description="Are you sure you want to permanently delete this contact inquiry? This destructive action cannot be undone."
        itemName={inquiryToDelete ? `${inquiryToDelete.name} (${inquiryToDelete.email})` : undefined}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setInquiryToDelete(null)}
      />
    </div>
  );
}
