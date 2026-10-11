"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How do you approach a new custom software engineering engagement?",
    answer:
      "We begin with a disciplined architectural scoping session to understand your business objectives, data flows, and technical constraints. Rather than vague estimates, we decompose requirements into modular milestone deliverables, define explicit API contracts and database schemas, and establish automated CI test gates from sprint zero.",
  },
  {
    question: "Who owns the intellectual property and code developed for our business?",
    answer:
      "You retain 100% full ownership of all custom source code, architecture specifications, deployment configurations, and technical assets developed under our commercial agreements upon milestone sign-off.",
  },
  {
    question: "What engineering standards and testing practices do you follow?",
    answer:
      "We maintain strict type-safety with TypeScript, enforce modular separation of concerns, and implement balanced test pyramids (unit, integration, and end-to-end user journeys). All pull requests pass automated linting, type checks, and regression tests before staging deployment.",
  },
  {
    question: "How are student apprentices and industry mentors integrated into PLAYQ Solutions?",
    answer:
      "Our apprenticeship program is a dedicated educational track that operates transparently and independently from mission-critical commercial deliverables. Apprentices work on simulated projects, open tooling, and synthetic case studies under synchronous mentor guidance to build verified portfolios.",
  },
  {
    question: "Can you assist with legacy codebase modernization and database tuning?",
    answer:
      "Yes. We perform thorough architecture health checks, dependency security scans, and database query profiling. We then execute incremental, zero-downtime refactoring and containerization strategies that de-risk operational transitions.",
  },
];

export function HomepageFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-950/60 border-t border-slate-850 relative" aria-labelledby="faq-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Clear Answers
            </span>
          </div>
          <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-300 mt-3 leading-relaxed">
            Transparent insights into how we engineer software, protect client IP, and maintain
            high technical reliability.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl glass-panel border border-slate-800/80 overflow-hidden transition-colors hover:border-slate-700/80"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="text-base sm:text-lg font-bold text-white flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/40"
                  >
                    <p className="pl-8">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-14 p-6 rounded-2xl bg-slate-900/40 border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-base font-bold text-white">Have a specific technical question?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Speak directly with an engineer to evaluate your project scope or architectural challenges.
            </p>
          </div>
          <Button href="/contact?type=business" variant="outline" size="sm" className="gap-2 shrink-0">
            <span>Ask an Engineer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
