import React from "react";
import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { Badge } from "@/components/ui/Badge";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection",
  description: `Privacy policy, data collection disclosure, and user data rights for ${brandConfig.companyName}.`,
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="cyan" className="mb-3">
            Legal & Data Governance
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy & Data Processing Notice
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-2">
            Last Updated: October 2026 &bull; Version 1.0 (Prelaunch Template)
          </p>
        </div>

        {/* Legal Review Required Notice */}
        <div className="p-5 mb-10 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">
              Legal Compliance Notice:
            </span>
            This privacy policy is an operational template prepared for {brandConfig.companyName}.
            Before public launch and commercial operation, this document must be reviewed and
            tailored by qualified legal counsel in accordance with applicable data protection laws
            (such as GDPR, CCPA, or local jurisdiction mandates).
          </div>
        </div>

        {/* Policy Body */}
        <div className="prose prose-invert max-w-none text-slate-300 space-y-8 text-sm leading-relaxed">
          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">1. Overview & Data Controller</h2>
            <p>
              {brandConfig.companyName} (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides technical
              software engineering solutions and apprenticeship programs. This Privacy Policy
              describes how we collect, process, and protect your personal data when you interact
              with our website ({brandConfig.websiteUrl}) and associated contact or application forms.
            </p>
            <p className="mt-2 text-xs font-mono text-cyan-300">
              Data Controller Contact: {brandConfig.primaryEmail}
            </p>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">2. Information We Collect</h2>
            <p>We collect only information necessary to deliver our services and evaluate candidate applications:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong className="text-white">Business Inquiries:</strong> Name, professional email address, organization name, project requirements, budget range, and timeline estimates.
              </li>
              <li>
                <strong className="text-white">Student Internship Applications:</strong> Full name, email address, phone number (optional), educational program/institution, self-reported skills, statement of motivation, and links to public GitHub or LinkedIn profiles.
              </li>
              <li>
                <strong className="text-white">Mentor Inquiries:</strong> Full name, professional email address, area of technical expertise, preferred collaboration track, and introductory background.
              </li>
              <li>
                <strong className="text-white">Technical Metadata:</strong> IP addresses and request timestamps captured solely for rate limiting, anti-abuse protection, and diagnostic server logs.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">3. Purpose and Legal Basis of Processing</h2>
            <p>We process your personal information under the following legal bases:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong className="text-white">Consent:</strong> When you voluntarily submit inquiries or applications via our web forms.
              </li>
              <li>
                <strong className="text-white">Contractual Preparation:</strong> To scope requested engineering deliverables and provide technical proposals.
              </li>
              <li>
                <strong className="text-white">Legitimate Interests:</strong> Protecting the security and availability of our web applications against malicious bot traffic and automated spam.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">4. Data Retention & Deletion Schedule</h2>
            <p>
              We adhere to strict data minimization principles. Candidate internship applications
              are retained for a maximum of 12 months following cohort evaluation, after which
              identifiable applicant records are scrubbed. General inquiries that do not progress to
              a business engagement are archived or deleted after 18 months.
            </p>
            <p className="mt-2">
              You may request immediate deletion of your submitted application or inquiry at any
              time by emailing <code className="text-cyan-300 font-mono">{brandConfig.primaryEmail}</code> with the subject &quot;Data Deletion Request&quot;.
            </p>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">5. Data Sharing and Third Parties</h2>
            <p>
              We do not sell, rent, or monetize personal information. Data is never shared with
              advertisers. We may transmit data strictly to trusted cloud infrastructure providers
              (e.g., managed database hosting and transactional email systems) that comply with
              binding data processing addendums and encryption standards.
            </p>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">6. Security Safeguards</h2>
            <p>
              We implement industry-standard safeguards including HTTPS encryption in transit,
              parameterized database queries, server-side Zod validation schemas, rate limiting, and
              honeypot bot detection.
            </p>
          </section>

          <section className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-2">7. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have rights to access, rectify, port, or restrict
              the processing of your personal data. Contact us at{" "}
              <a href={`mailto:${brandConfig.primaryEmail}`} className="text-cyan-400 underline">
                {brandConfig.primaryEmail}
              </a>{" "}
              to exercise any applicable rights.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
