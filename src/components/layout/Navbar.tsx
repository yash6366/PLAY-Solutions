"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brand";
import { mainNav } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Menu, X, ArrowRight, Layers } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#080B14]/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/30 py-3"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            aria-label={`${brandConfig.shortName} Homepage`}
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center p-[1px] shadow-sm shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <div className="w-full h-full bg-[#080C14] rounded-[11px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-400 group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                {brandConfig.shortName}
              </span>
              <span className="text-[10px] text-cyan-400/90 tracking-widest uppercase font-mono font-medium">
                Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "text-cyan-300 bg-blue-500/10 border border-blue-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.title}
                  {item.badge && (
                    <Badge variant="cyan" className="text-[10px] py-0 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              href="/contact?type=business"
              variant="primary"
              size="sm"
              className="gap-2"
            >
              <span>Discuss a Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              href="/contact?type=business"
              variant="primary"
              size="sm"
              className="sm:hidden text-xs px-2.5 py-1.5"
            >
              Discuss
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle main menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[65px] bg-[#080B14]/98 backdrop-blur-xl z-40 lg:hidden overflow-y-auto border-t border-slate-800/80 px-6 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="flex flex-col gap-3">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600/20 text-cyan-300 border border-blue-500/30"
                      : "text-slate-200 hover:bg-slate-850 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.title}</span>
                  {item.badge && <Badge variant="cyan">{item.badge}</Badge>}
                </Link>
              );
            })}

            <div className="pt-6 mt-4 border-t border-slate-800/80 flex flex-col gap-3">
              <Button
                href="/contact?type=business"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discuss a Project
              </Button>
              <Button
                href="/internships"
                variant="outline"
                size="md"
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Careers
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
