import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Compass, Home, Layers, Briefcase, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2">
          <Badge variant="cyan">404 Error</Badge>
          <span className="text-xs text-neutral-400 font-mono tracking-wider">RESOURCE_NOT_FOUND</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-lg mx-auto">
            The requested service specification, project blueprint, or resource does not exist or has been relocated.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm max-w-lg mx-auto">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            Recommended Navigation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <Link
              href="/services"
              className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/40 hover:bg-neutral-800/80 border border-neutral-700/40 hover:border-cyan-500/30 transition-colors text-sm text-neutral-300 hover:text-white"
            >
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Explore Services</span>
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/40 hover:bg-neutral-800/80 border border-neutral-700/40 hover:border-cyan-500/30 transition-colors text-sm text-neutral-300 hover:text-white"
            >
              <Briefcase className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Technical Projects</span>
            </Link>
            <Link
              href="/internships"
              className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/40 hover:bg-neutral-800/80 border border-neutral-700/40 hover:border-cyan-500/30 transition-colors text-sm text-neutral-300 hover:text-white"
            >
              <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Careers</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/40 hover:bg-neutral-800/80 border border-neutral-700/40 hover:border-cyan-500/30 transition-colors text-sm text-neutral-300 hover:text-white"
            >
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Contact Engineering</span>
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="lg" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
