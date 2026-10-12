"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  GraduationCap,
  Briefcase,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  User,
} from "lucide-react";
import { brandConfig } from "@/config/brand";
import { AdminSessionPayload } from "@/server/auth/jwt";

interface AdminDashboardShellProps {
  user: AdminSessionPayload;
  children: React.ReactNode;
}

const navItems = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Contact Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    name: "Careers & Postings",
    href: "/admin/careers",
    icon: Briefcase,
  },
  {
    name: "Internship Applications",
    href: "/admin/internships",
    icon: GraduationCap,
  },
  {
    name: "Expert Inquiries",
    href: "/admin/experts",
    icon: Users,
  },
];

export function AdminDashboardShell({ user, children }: AdminDashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-900/60 text-purple-300 border-purple-700/60";
      case "ADMIN":
        return "bg-blue-900/60 text-blue-300 border-blue-700/60";
      case "REVIEWER":
      default:
        return "bg-emerald-900/60 text-emerald-300 border-emerald-700/60";
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#070913] text-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#080B14] rounded-[7px] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-bold text-white text-sm tracking-tight">
            {brandConfig.shortName} <span className="text-cyan-400 font-normal">Staff</span>
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo / Portal Title */}
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-[1px] shadow-md shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#080B14] rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight">
                {brandConfig.companyName}
              </div>
              <div className="text-[11px] text-cyan-400 font-medium tracking-wide uppercase">
                Staff Operations
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-3 my-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Access Role</span>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${getRoleBadge(
                  user.role
                )}`}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Management Portals
            </div>
            {navItems.map((item) => {
              const active = isLinkActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-600/15 text-cyan-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] text-slate-400">View</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? "Ending Session..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
