import React from "react";
import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { Badge } from "@/components/ui/Badge";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms and conditions governing the use of ${brandConfig.companyName}'s website and submission portals.`,
};

export default function TermsPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="cyan" className="mb-3">
            Legal Terms & Agreement
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-2">
            Last Updated: October 2026 &bull; Version 1.0 (Prelaunch Template)
          </p>
        </div>

        {/* Legal Review Warning */}
        <div className="p-5 mb-10 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">
              Legal Review Requirement:
            </span>
            This document is a foundational template. Before launch, these terms must be formally
            reviewed by legal counsel to ensure alignment with governing contracts, master services
            agreements (MSAs), and relevant commercial jurisdictions.
          </div>
        </div>

        {/* Terms Body */}
        <div className="prose prose-invert max-w-none text-slate-300 space-y-8 text-sm leading-relaxed">
          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using the website ({brandConfig.websiteUrl}) and communication
              interfaces operated by {brandConfig.companyName} (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), you
              agree to be bound by these Terms of Service. If you do not agree, you must discontinue
              use of this site.
            </p>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">2. Acceptable Use Policy</h2>
            <p>When using this site and submitting forms, you agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Submit fraudulent, defamatory, or deceptive project inquiries or credentials.</li>
              <li>Attempt to bypass rate limits, probe server endpoints, or launch denial-of-service attacks.</li>
              <li>Transmit automated spam, scrapers, or bot payloads through contact or application forms.</li>
              <li>Inject malicious scripts, payloads, or unauthorized file uploads into any field.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">3. Intellectual Property Rights</h2>
            <p>
              All trademarks, text, graphics, logos, 3D visualizations, and code architecture
              presented on this website are the intellectual property of {brandConfig.companyName} or
              its licensors. No content may be reproduced or mirrored without express written consent.
            </p>
            <p className="mt-2">
              Software engineered under formal client contracts is governed by individual Master
              Services Agreements (MSAs) and statement-of-work documents, which stipulate client IP
              ownership upon milestone settlement.
            </p>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">4. Internship Application Disclosures</h2>
            <p>
              Submission of an internship application through this site does not constitute an offer
              of employment, apprenticeship contract, or academic credit grant. Candidate selection
              is subject to technical evaluation, capacity availability, and interview verification.
              Actual terms, duration, and compensation status are confirmed exclusively through formal
              written acceptance agreements.
            </p>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">5. Disclaimers & Limitation of Liability</h2>
            <p>
              This website and its informational content are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
              basis without warranties of any kind. {brandConfig.companyName} disclaims all warranties,
              express or implied, including fitness for a particular purpose and uninterrupted uptime.
            </p>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">6. Modifications & Governing Law</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the website
              following published updates indicates acceptance of revised terms.
            </p>
            <p className="mt-2 text-xs font-mono text-cyan-300">
              Inquiries regarding these terms: {brandConfig.primaryEmail}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
