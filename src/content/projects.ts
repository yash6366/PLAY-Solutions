export type ProjectStatus = "Completed" | "Demonstration" | "Prototype" | "Work in Progress";

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: "Enterprise Software" | "Web & Mobile" | "AI & Automation" | "Internal R&D";
  status: ProjectStatus;
  summary: string;
  problemStatement: string;
  solution: string;
  technologies: string[];
  deliverables: string[];
  published: boolean;
  isFeatured?: boolean;
  githubUrl?: string;
  demoUrl?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: "sentinel-analytics",
    slug: "sentinel-analytics",
    title: "Sentinel Fleet Telemetry Platform",
    category: "Enterprise Software",
    status: "Demonstration",
    summary:
      "A real-time telemetry streaming and fleet health monitoring architecture designed for high-frequency sensor data processing.",
    problemStatement:
      "Distributed logistics fleets produce hundreds of sensor telemetry events per second. Legacy reporting engines struggled with multi-second ingestion lag, preventing dispatchers from identifying overheating engines or unexpected route deviations in real time.",
    solution:
      "Architected an event-driven ingestion pipeline utilizing lightweight message brokers, timeseries data aggregation, and an interactive real-time dashboard with dynamic threshold alerting.",
    technologies: ["TypeScript", "Node.js", "WebSockets", "TimescaleDB", "Tailwind CSS", "Docker"],
    deliverables: [
      "High-throughput WebSocket telemetry ingestion service",
      "Interactive multi-vehicle live tracking dashboard",
      "Configurable threshold alert notification system",
      "Automated load testing suite verifying 10,000 concurrent events/sec",
    ],
    published: true,
    isFeatured: true,
    demoUrl: "/projects/sentinel-analytics",
  },
  {
    id: "aegis-rag-engine",
    slug: "aegis-rag-engine",
    title: "Aegis Enterprise Document Intelligence",
    category: "AI & Automation",
    status: "Prototype",
    summary:
      "A privacy-preserving document synthesis and semantic search engine for dense regulatory and compliance filings.",
    problemStatement:
      "Legal and compliance teams spent excessive hours manually cross-referencing multi-hundred-page policy documents across conflicting international guidelines, with severe risks associated with sending confidential files to public AI APIs.",
    solution:
      "Engineered an air-gapped Retrieval-Augmented Generation (RAG) prototype with local vector embeddings, chunk-level provenance citations, and zero external network leakage.",
    technologies: ["Python", "FastAPI", "Qdrant", "LangChain", "Next.js", "Tailwind CSS"],
    deliverables: [
      "Document ingestion and recursive chunking pipeline",
      "Semantic vector search with source document page citations",
      "Air-gapped deployment blueprint for private cloud infrastructure",
    ],
    published: true,
    isFeatured: true,
    demoUrl: "/projects/aegis-rag-engine",
  },
  {
    id: "pulse-health-portal",
    slug: "pulse-health-portal",
    title: "Pulse Clinical Appointment & Intake Portal",
    category: "Web & Mobile",
    status: "Demonstration",
    summary:
      "An accessible, mobile-first patient intake and appointment management interface with automated scheduling confirmation.",
    problemStatement:
      "Outpatient clinics faced high no-show rates and phone-line congestion due to cumbersome paper-based intake forms and lack of digital calendar integration for patients.",
    solution:
      "Created an intuitive, WCAG 2.2 AA compliant patient intake portal with responsive mobile layout, digital signature capture, and automated appointment calendar integration.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Zod"],
    deliverables: [
      "Patient-facing mobile-first intake and scheduling workflow",
      "Clinic administration dashboard for calendar slot management",
      "End-to-end form validation with strict sanitization",
    ],
    published: true,
    isFeatured: true,
    demoUrl: "/projects/pulse-health-portal",
  },
  {
    id: "mesh-api-gateway",
    slug: "mesh-api-gateway",
    title: "Mesh Edge Rate-Limiting & Auth Gateway",
    category: "Internal R&D",
    status: "Work in Progress",
    summary:
      "A lightweight, distributed edge proxy providing token bucket rate-limiting and JWT signature verification for microservices.",
    problemStatement:
      "Microservices deployed across multiple cloud environments needed a centralized, low-latency mechanism to enforce consistent API key rate limits and request signing without bloating each individual application codebase.",
    solution:
      "Developed a modular edge gateway prototype with sliding-window rate limiting, structured audit logging, and automated OpenAPI validation.",
    technologies: ["Go", "Redis", "Docker", "Prometheus", "OpenAPI"],
    deliverables: [
      "Low-latency proxy reverse server",
      "Distributed Redis sliding-window rate limiter",
      "Grafana metrics dashboard for gateway latency and rejection rates",
    ],
    published: true,
    isFeatured: false,
  },
];
