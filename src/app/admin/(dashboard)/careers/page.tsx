"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  X,
  Save,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";

interface Opportunity {
  id: string;
  jobId: string;
  slug: string;
  title: string;
  department: string;
  type: string;
  description: string;
  eligibility: string;
  skills: string[];
  requiredSkills: string[];
  duration: string;
  locationMode: string;
  compensationStatus: string;
  deadline: string;
  availablePositions: number;
  published: boolean;
  applicantCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminCareersPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PUBLISHED, DRAFT
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [formJobId, setFormJobId] = useState("00011");
  const [formTitle, setFormTitle] = useState("");
  const [formDepartment, setFormDepartment] = useState("Backend Engineering");
  const [formType, setFormType] = useState("Technical Internship");
  const [formDescription, setFormDescription] = useState("");
  const [formEligibility, setFormEligibility] = useState("");
  const [formSkills, setFormSkills] = useState("");
  const [formDuration, setFormDuration] = useState("12 Weeks (Flexible: 15–20 hours / week)");
  const [formLocationMode, setFormLocationMode] = useState("Remote (Global)");
  const [formCompensation, setFormCompensation] = useState("Educational / Project Stipend Evaluated per Cohort");
  const [formDeadline, setFormDeadline] = useState("Rolling Admissions for 2026/2027 Cohorts");
  const [formPositions, setFormPositions] = useState("2");
  const [formPublished, setFormPublished] = useState(true);

  // Delete Modal State
  const [oppToDelete, setOppToDelete] = useState<Opportunity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/opportunities");
      if (!res.ok) {
        throw new Error("Failed to load career opportunities.");
      }
      const data = await res.json();
      setOpportunities(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading opportunities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const openCreateModal = () => {
    setEditingOpp(null);
    const maxNum = opportunities.reduce((max, opp) => {
      const num = parseInt((opp.jobId || "").replace(/\D/g, ""), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 10);
    const nextJobId = (maxNum + 1).toString().padStart(5, "0");
    setFormJobId(nextJobId);
    setFormTitle("");
    setFormDepartment("Backend Engineering");
    setFormType("Technical Internship");
    setFormDescription("");
    setFormEligibility("Current undergraduate/graduate students in Computer Science, Software Engineering, or related fields.");
    setFormSkills("TypeScript, React, Node.js, PostgreSQL, Git");
    setFormDuration("12 Weeks (Flexible: 15–20 hours / week)");
    setFormLocationMode("Remote (Global)");
    setFormCompensation("Educational / Project Stipend Evaluated per Cohort");
    setFormDeadline("Rolling Admissions for 2026/2027 Cohorts");
    setFormPositions("2");
    setFormPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (opp: Opportunity) => {
    setEditingOpp(opp);
    setFormJobId(opp.jobId || "00011");
    setFormTitle(opp.title);
    setFormDepartment(opp.department);
    setFormType(opp.type);
    setFormDescription(opp.description);
    setFormEligibility(opp.eligibility);
    setFormSkills((opp.skills || opp.requiredSkills || []).join(", "));
    setFormDuration(opp.duration);
    setFormLocationMode(opp.locationMode);
    setFormCompensation(opp.compensationStatus);
    setFormDeadline(opp.deadline);
    setFormPositions(opp.availablePositions.toString());
    setFormPublished(opp.published);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      alert("Please provide both a title and description.");
      return;
    }

    const skillsArray = formSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      jobId: formJobId.trim() || undefined,
      title: formTitle.trim(),
      department: formDepartment,
      type: formType.trim(),
      description: formDescription.trim(),
      eligibility: formEligibility.trim(),
      skills: skillsArray.length > 0 ? skillsArray : ["General Engineering"],
      duration: formDuration.trim(),
      locationMode: formLocationMode.trim(),
      compensationStatus: formCompensation.trim(),
      deadline: formDeadline.trim(),
      availablePositions: parseInt(formPositions, 10) || 1,
      published: formPublished,
    };

    try {
      setIsSaving(true);
      const url = editingOpp
        ? `/api/admin/opportunities/${editingOpp.id}`
        : "/api/admin/opportunities";
      const method = editingOpp ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save career opening");
      }

      showToast(
        editingOpp
          ? `✓ Opening updated! Live changes reflected on the website portal.`
          : `✓ New career opening created and published!`
      );
      setIsModalOpen(false);
      fetchOpportunities();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving opportunity");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublished = async (opp: Opportunity) => {
    try {
      const nextPublished = !opp.published;
      const res = await fetch(`/api/admin/opportunities/${opp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextPublished }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setOpportunities((prev) =>
        prev.map((o) => (o.id === opp.id ? { ...o, published: nextPublished } : o))
      );
      showToast(
        nextPublished
          ? `✓ "${opp.title}" is now PUBLISHED and visible on the website portal!`
          : `ℹ️ "${opp.title}" is now UNPUBLISHED (hidden from website portal).`
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  const handleDelete = async () => {
    if (!oppToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/opportunities/${oppToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete opening");

      showToast(`✓ Removed career opening "${oppToDelete.title}".`);
      setOppToDelete(null);
      fetchOpportunities();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting opening");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered List
  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      (opp.jobId || "").toLowerCase().includes(search.toLowerCase()) ||
      opp.department.toLowerCase().includes(search.toLowerCase()) ||
      opp.type.toLowerCase().includes(search.toLowerCase()) ||
      (opp.skills || []).some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && opp.published) ||
      (statusFilter === "DRAFT" && !opp.published);

    return matchesSearch && matchesStatus;
  });

  const totalPublished = opportunities.filter((o) => o.published).length;
  const totalDraft = opportunities.filter((o) => !o.published).length;
  const totalApplicants = opportunities.reduce((acc, o) => acc + (o.applicantCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-cyan-400" />
              Careers & Internship Postings
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
              Live Linked to Website
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage open engineering roles and student opportunities. Updates here instantly sync
            to the public{" "}
            <Link
              href="/internships"
              target="_blank"
              className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono text-xs"
            >
              Careers Portal (/internships) <ExternalLink className="w-3 h-3" />
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOpportunities}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-900/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opening</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400">Total Postings</span>
            <p className="text-2xl font-bold text-white mt-1">{opportunities.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-800/50 text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400">Live on Portal</span>
            <p className="text-2xl font-bold text-emerald-300 mt-1">{totalPublished}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-400">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400">Drafts / Hidden</span>
            <p className="text-2xl font-bold text-slate-300 mt-1">{totalDraft}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400">Student Applicants</span>
            <p className="text-2xl font-bold text-cyan-300 mt-1">{totalApplicants}</p>
          </div>
          <Link
            href="/admin/internships"
            className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 hover:text-cyan-300 transition-colors"
            title="View Applications"
          >
            <GraduationCap className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search openings by title, department, or required skill..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Portal Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/60"
          >
            <option value="ALL">All Postings ({opportunities.length})</option>
            <option value="PUBLISHED">Published Live ({totalPublished})</option>
            <option value="DRAFT">Drafts ({totalDraft})</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Content Table / Cards */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-xs font-mono">Synchronizing career openings...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No career opportunities found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your search criteria or filters."
              : "Post your first career or internship opportunity to show on the website portal."}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post Opening</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              className={`p-6 rounded-2xl border transition-all ${
                opp.published
                  ? "bg-slate-900/60 border-slate-800/80 hover:border-cyan-500/40"
                  : "bg-slate-950/50 border-slate-850 opacity-80"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-800">
                      <span className="text-cyan-500">Job ID:</span> #{opp.jobId || "00011"}
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-xs font-mono uppercase text-cyan-400">
                      {opp.department}
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-xs font-mono text-slate-300 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-750">
                      {opp.type}
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                        opp.published
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
                          : "bg-amber-950/80 text-amber-300 border-amber-800/80"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          opp.published ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      {opp.published ? "Live on Portal" : "Draft (Hidden)"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 max-w-3xl leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Badges / Meta */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {opp.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {opp.locationMode}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      Deadline: {opp.deadline}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      Positions: {opp.availablePositions}
                    </span>
                    <Link
                      href={`/admin/internships?search=${encodeURIComponent(opp.title)}`}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/60 text-blue-300 hover:bg-blue-900/60 font-mono transition-colors"
                    >
                      <GraduationCap className="w-3 h-3" />
                      <span>{opp.applicantCount || 0} Applicants</span>
                    </Link>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(opp.skills || opp.requiredSkills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-850">
                  <button
                    onClick={() => handleTogglePublished(opp)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      opp.published
                        ? "bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/40"
                        : "bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/40"
                    }`}
                    title={opp.published ? "Unpublish from portal" : "Publish to portal"}
                  >
                    {opp.published ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openEditModal(opp)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    title="Edit opening details"
                  >
                    <Edit className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Edit</span>
                  </button>

                  <Link
                    href="/internships"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-colors"
                    title="View public page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setOppToDelete(opp)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete career opening"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                {editingOpp ? "Edit Career Opportunity" : "Post New Career Opportunity"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Job ID <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formJobId}
                    onChange={(e) => setFormJobId(e.target.value)}
                    placeholder="e.g. 00011"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                    Starts from 00011
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Position Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Full-Stack Software Engineering Intern"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Backend Engineering">Backend Engineering</option>
                    <option value="Frontend Engineering">Frontend Engineering</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Mobile Engineering">Mobile Engineering</option>
                    <option value="QA & Automation">QA & Automation</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Security Engineering">Security Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Program Type <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      list="program-types-list"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      placeholder="Type custom program type or choose..."
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <datalist id="program-types-list">
                      <option value="Technical Internship" />
                      <option value="Project Apprenticeship" />
                      <option value="Research Fellowship" />
                      <option value="Full-Time Engineering" />
                      <option value="Junior Software Engineer" />
                      <option value="Graduate Engineering Trainee" />
                      <option value="Summer Internship" />
                      <option value="Contract / Project-Based" />
                    </datalist>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                    Typeable &mdash; enter any custom title or choose suggestion
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Position Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Overview of what the candidate will build and learn..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Required Core Skills (comma separated) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  placeholder="e.g. TypeScript, React, Next.js, PostgreSQL, Docker"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Candidate Eligibility & Profile <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formEligibility}
                  onChange={(e) => setFormEligibility(e.target.value)}
                  placeholder="e.g. Undergraduate/graduate students in Computer Science or self-taught developers..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 12 Weeks (Flexible: 15–20 hours / week)"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Location Mode
                  </label>
                  <select
                    value={formLocationMode}
                    onChange={(e) => setFormLocationMode(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Remote (Global)">Remote (Global)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-Site">On-Site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Compensation / Stipend Terms
                  </label>
                  <input
                    type="text"
                    value={formCompensation}
                    onChange={(e) => setFormCompensation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Available Open Positions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formPositions}
                    onChange={(e) => setFormPositions(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Application Deadline
                </label>
                <input
                  type="text"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  placeholder="e.g. Rolling Admissions for 2026/2027 Cohorts"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Published Switch */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-white block">Publish Status</span>
                  <span className="text-xs text-slate-400">
                    When enabled, this opening is instantly visible on the public website portal.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormPublished(!formPublished)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formPublished ? "bg-cyan-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formPublished ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Portal...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingOpp ? "Save Changes" : "Create & Publish"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(oppToDelete)}
        title="Delete Career Opening"
        description="Are you sure you want to delete this career opening? This will permanently remove the listing from the database and public portal."
        itemName={oppToDelete?.title}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setOppToDelete(null)}
      />
    </div>
  );
}
