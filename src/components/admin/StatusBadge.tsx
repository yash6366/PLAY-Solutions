import React from "react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case "NEW":
      case "SUBMITTED":
      case "PENDING":
        return "bg-cyan-950/80 text-cyan-300 border-cyan-800/80";
      case "IN_PROGRESS":
      case "IN_REVIEW":
      case "UNDER_REVIEW":
        return "bg-amber-950/80 text-amber-300 border-amber-800/80";
      case "CONTACTED":
      case "SHORTLISTED":
        return "bg-blue-950/80 text-blue-300 border-blue-800/80";
      case "CLOSED":
      case "ACTIVE":
      case "ACCEPTED":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-800/80";
      case "REJECTED":
      case "DECLINED":
        return "bg-rose-950/80 text-rose-300 border-rose-800/80";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const formatText = (s: string) => {
    return s.replace(/_/g, " ");
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase font-mono ${getStyle(
        status
      )}`}
    >
      {formatText(status)}
    </span>
  );
}
