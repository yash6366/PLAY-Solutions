import React from "react";
import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { ContactForm } from "@/components/forms/ContactForm";
import { Badge } from "@/components/ui/Badge";
import { Mail, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Project Inquiries",
  description:
    "Discuss a custom engineering project, explore student apprenticeship admissions, or propose an industry mentorship collaboration.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-24">
      {/* Header */}
      <section className="py-16 border-b border-slate-850 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="cyan" className="mb-4">
              Direct Inquiries
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Connect With Our Engineering Team
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              Whether you are an organization looking to build digital products, a student seeking
              apprenticeship, or an industry expert exploring collaboration—we invite you to get in
              touch.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Expectations */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-7 rounded-3xl glass-panel border border-slate-800/80 space-y-5">
              <h2 className="text-xl font-bold text-white mb-2">Direct Contact</h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-slate-400 block text-[11px]">Primary Email</span>
                    <a
                      href={`mailto:${brandConfig.primaryEmail}`}
                      className="text-white hover:text-cyan-300 transition-colors"
                    >
                      {brandConfig.primaryEmail}
                    </a>
                  </div>
                </div>

                {brandConfig.contactPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-slate-400 block text-[11px]">Phone</span>
                      <span className="text-white">{brandConfig.contactPhone}</span>
                    </div>
                  </div>
                )}

                {brandConfig.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-slate-400 block text-[11px]">Location</span>
                      <span className="text-white">{brandConfig.location}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-slate-400 block text-[11px]">Response Standard</span>
                    <span className="text-white">Within 1–2 business days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Security & Confidentiality</span>
              </div>
              <p className="leading-relaxed">
                All inquiries submitted are protected by strict server-side validation and SSL
                encryption. We never share client specifications or contact details with unauthorized
                third parties.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-8">
            <ContactForm initialType="business" />
          </div>
        </div>
      </section>
    </div>
  );
}
