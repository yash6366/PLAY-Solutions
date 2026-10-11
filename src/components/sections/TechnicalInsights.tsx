import React from "react";
import Link from "next/link";
import { Terminal, Shield, Activity, ArrowRight, Check } from "lucide-react";

export function TechnicalInsights() {
  const insights = [
    {
      title: "End-to-End Type Safety & Contract Integrity",
      category: "Architecture Standard",
      description:
        "We eliminate runtime ambiguity by establishing compile-time and runtime validation contracts across every boundary—from HTTP ingress (Zod) to database queries (Prisma/PostgreSQL).",
      bulletPoints: [
        "Strict input normalization blocking prototype pollution & injection",
        "Deterministic API error payloads with typed client consumption",
        "Automated Vitest integration suites verifying contract bounds",
      ],
      icon: Terminal,
      codePreview: `// Strict Boundary Schema Contract
export const apiPayloadSchema = z.object({
  entityId: z.string().uuid(),
  timestamp: z.number().int().positive(),
  metrics: z.record(z.string(), z.number()),
});
export type ValidatedPayload = z.infer<typeof apiPayloadSchema>;`,
    },
    {
      title: "Air-Gapped Vector Search & Deterministic Citations",
      category: "AI & RAG Engineering",
      description:
        "Enterprise intelligence requires zero data leakage and verifiable answers. We engineer private vector search pipelines where every generative output must cite exact source chunks.",
      bulletPoints: [
        "Local sentence-transformers embeddings without outbound API calls",
        "Reciprocal Rank Fusion (RRF) combining dense & sparse vector indices",
        "Zero data retention policies guaranteeing model training isolation",
      ],
      icon: Shield,
      codePreview: `// Private VPC Citation Guardrail
interface RetrievalProvenance {
  documentId: string;
  pageNumber: number;
  verbatimExcerpt: string;
  cosineConfidence: number; // >= 0.82 threshold
}`,
    },
    {
      title: "High-Throughput Ingestion & Dynamic Anomaly Alerts",
      category: "Distributed Systems",
      description:
        "High-frequency sensor and financial telemetry demands asynchronous decoupling. Ingestion gateways validate payloads before queueing into Redis Pub/Sub for sub-second dashboard delivery.",
      bulletPoints: [
        "Token-bucket rate limiting preventing broker memory exhaustion",
        "TimescaleDB hyper-table partitioning with automated rollup policies",
        "Multiplexed WebSockets delivering real-time vehicle updates",
      ],
      icon: Activity,
      codePreview: `// Real-Time Event Pipeline Decoupling
gateway.on("telemetry", async (event) => {
  await rateLimiter.consume(event.deviceId);
  await messageBroker.publish("fleet.events", event);
  await timeSeriesStore.batchInsert(event);
});`,
    },
  ];

  return (
    <section className="py-24 relative bg-slate-950/40 border-t border-slate-850" aria-labelledby="insights-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold block mb-2">
              Engineering Disciplines
            </span>
            <h2
              id="insights-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              How We Architect Production Systems
            </h2>
            <p className="text-base text-slate-300 mt-3 leading-relaxed">
              We apply rigorous software engineering principles, verifiable test gates, and modern
              distributed patterns to ensure system resilience and maintainability.
            </p>
          </div>

          <Link
            href="/about"
            className="text-sm font-semibold text-blue-400 hover:text-white flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0"
          >
            <span>Learn About Our Principles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Detailed Technical Cards with Code Snippets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {insights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between hover:border-blue-500/30 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="space-y-2 mb-5">
                    {item.bulletPoints.map((bp, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-[11px] text-slate-400">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code / Configuration Snippet */}
                <div className="rounded-xl bg-[#050811] p-3.5 border border-slate-850 font-mono text-[11px] text-slate-300 overflow-x-auto selection:bg-blue-600">
                  <pre className="whitespace-pre text-slate-400">
                    <code>{item.codePreview}</code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
