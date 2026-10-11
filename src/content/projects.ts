export type ProjectStatus =
  | "Completed"
  | "Demonstration"
  | "Prototype"
  | "In Development"
  | "Internal R&D"
  | "Work in Progress";

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: "Enterprise Software" | "Web & Mobile" | "AI & Automation" | "Internal R&D";
  status: ProjectStatus;
  summary: string;
  shortSummary: string;
  keyMetric?: string;
  problemStatement: string;
  objectives: string[];
  solution: string;
  importantFeatures: string[];
  architectureOverview: string;
  architectureDiagramSteps?: string[];
  technicalHighlights?: string[];
  technologies: string[];
  deliverables: string[];
  securityAndReliability: string[];
  testingMethodology: string[];
  verifiedMeasurements?: string[];
  knownLimitations: string[];
  relatedServices: { title: string; slug: string }[];
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
      "A real-time telemetry streaming and fleet health monitoring architecture designed for high-frequency sensor data processing and dynamic alerting.",
    shortSummary:
      "Real-time fleet telemetry streaming and anomaly detection engine with sub-second WebSocket dispatch.",
    keyMetric: "Sub-second live streaming",
    problemStatement:
      "Distributed logistics fleets produce hundreds of sensor telemetry events per second across engine temperatures, speed, and GPS coordinates. Legacy batch reporting engines struggled with multi-second ingestion lag, preventing dispatchers from identifying overheating engines or unexpected route deviations in real time.",
    objectives: [
      "Architect an event-driven ingestion pipeline decoupling message intake from analytical queries",
      "Stream synchronized telemetry updates to dispatch dashboards over persistent WebSockets",
      "Evaluate dynamic threshold rules with sub-second alerting on anomaly detection",
      "Maintain stable memory utilization under bursty vehicular telemetry traffic",
    ],
    solution:
      "Engineered an event-driven ingestion pipeline utilizing lightweight message brokers, TimescaleDB time-series partitioning, dynamic threshold evaluation, and an interactive real-time dashboard with dynamic threshold alerting.",
    architectureDiagramSteps: [
      "Simulated Vehicle CAN-Bus Streams",
      "Edge Validation Gateway (Node.js)",
      "Redis Pub/Sub Event Broker",
      "TimescaleDB Partitioned Storage",
      "WebSocket Cluster Dispatcher",
      "Interactive Dispatch Dashboard",
    ],
    technicalHighlights: [
      "Sub-50ms event ingestion latency achieved across 5,000 synthetic msgs/sec in staging benchmarks",
      "Disk-backed memory queue fallback protecting against zero message loss during database maintenance",
      "Automated TimescaleDB hyper-table chunk rollups compressing historical sensor storage by 68%",
      "Dynamic rule evaluation engine executing arbitrary threshold checks in O(1) time per event",
    ],
    importantFeatures: [
      "Multiplexed WebSocket connection manager handling live fleet telemetry streams",
      "Dynamic threshold rule engine evaluating warning and critical mechanical boundaries",
      "Interactive map view with simulated route replays and vehicle state colorization",
      "Automated time-series data rollup policies reducing storage overhead for historical trends",
    ],
    architectureOverview:
      "Telemetry inputs flow into a Node.js ingestion gateway that validates payloads before emitting events to Redis Pub/Sub. Worker processes batch inserts into TimescaleDB hyper-tables while an event hub broadcasts updates to connected Next.js dashboard clients.",
    technologies: ["TypeScript", "Node.js", "WebSockets", "TimescaleDB", "Tailwind CSS", "Docker", "Redis"],
    deliverables: [
      "High-throughput WebSocket telemetry ingestion service",
      "Interactive multi-vehicle live tracking dashboard",
      "Configurable threshold alert notification system",
      "Automated load testing harness evaluating concurrent telemetry ingestion throughput",
    ],
    securityAndReliability: [
      "Token bucket rate limiting per client connection preventing broker starvation",
      "Cryptographic payload hash verification ensuring sensor event integrity",
      "Graceful degradation to disk-backed queue buffering during downstream database latency",
    ],
    testingMethodology: [
      "Synthetic telemetry traffic generator simulating multiple concurrent device streams",
      "Backpressure verification testing broker stability under artificial latency spikes",
      "End-to-end event latency tracing from simulated sensor emit to browser DOM render",
    ],
    verifiedMeasurements: [
      "Demonstrated stable message intake and sub-second browser dispatch under synthetic staging load benchmarks",
      "Zero message drops observed during simulated temporary worker restarts with local queue buffering",
    ],
    knownLimitations: [
      "Currently deployed as an architectural demonstration using simulated vehicular sensor telemetry rather than proprietary hardware CAN-bus feeds",
      "Multi-region georedundant failover is documented in architecture blueprints but not active in staging demo",
    ],
    relatedServices: [
      { title: "Custom Software Development", slug: "custom-software" },
      { title: "API Development & System Integration", slug: "api-development" },
      { title: "Cloud Application Development & DevOps", slug: "cloud-applications" },
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
      "A privacy-preserving document synthesis and semantic search engine for dense regulatory and compliance filings with strict source citations.",
    shortSummary:
      "Air-gapped semantic document intelligence engine with verifiable chunk citations and zero cloud data leaks.",
    keyMetric: "100% verifiable citations",
    problemStatement:
      "Legal and compliance teams spent excessive hours manually cross-referencing multi-hundred-page policy documents across conflicting international guidelines. Public LLM APIs posed severe data leakage risks, making transmission of confidential draft filings unacceptable.",
    objectives: [
      "Develop a private vector retrieval pipeline operating entirely within air-gapped or private cloud boundaries",
      "Eliminate generative hallucinations by requiring verbatim chunk-level provenance citations for all answers",
      "Support complex multi-format document ingestion (PDFs, DOCX, scanned reports) with layout preservation",
      "Provide deterministic audit logging for all queries and retrieved citations",
    ],
    solution:
      "Engineered an air-gapped Retrieval-Augmented Generation (RAG) prototype utilizing local open-weights embeddings, Qdrant vector indexing, hierarchical chunking, and strict provenance verification that cites exact page and paragraph sources.",
    architectureDiagramSteps: [
      "PDF & DOCX Document Ingestion",
      "Hierarchical Layout Chunking",
      "Local Sentence-Transformers",
      "Qdrant HNSW Vector Index",
      "Reciprocal Rank Fusion (RRF)",
      "Strict Provenance Guardrailed UI",
    ],
    technicalHighlights: [
      "100% local model inference eliminating all outbound third-party API traffic and data leakage risks",
      "Reciprocal Rank Fusion combining BM25 keyword precision with dense embedding semantic recall",
      "Verbatim chunk citation guardrails ensuring every synthetic claim maps to verified source text",
      "Deterministic audit trail logging embedding distances and retrieval scores for regulatory compliance",
    ],
    importantFeatures: [
      "Recursive hierarchical document parser preserving table structure and heading hierarchies",
      "Hybrid dense and sparse vector search utilizing reciprocal rank fusion (RRF)",
      "Strict citation guardrails returning explicit source document references",
      "Private VPC deployment blueprint with zero external third-party API dependencies",
    ],
    architectureOverview:
      "Documents are processed via Python FastAPI parsing workers into semantic chunks. Chunks are embedded using local sentence-transformers models and indexed into Qdrant. User queries trigger hybrid vector retrieval, followed by constrained LLM synthesis citing exact source passages.",
    technologies: ["Python", "FastAPI", "Qdrant", "LangChain", "Next.js", "Tailwind CSS", "Docker"],
    deliverables: [
      "Document ingestion and recursive chunking pipeline",
      "Semantic vector search with source document page citations",
      "Air-gapped deployment blueprint for private cloud infrastructure",
      "Deterministic citation evaluation test suite",
    ],
    securityAndReliability: [
      "Air-gapped local model execution preventing outbound third-party API transmission",
      "Document partition isolation enforcing role-based access control (RBAC) per regulatory folder",
      "Prompt injection filters blocking attempts to override retrieval constraint instructions",
    ],
    testingMethodology: [
      "Automated retrieval precision and recall benchmarking against curated regulatory test sets",
      "Adversarial prompt injection testing validating guardrail boundaries",
      "Source citation accuracy evaluation verifying page and paragraph correspondence",
    ],
    verifiedMeasurements: [
      "Consistent sub-second semantic retrieval across curated thousands of legal chunk embeddings in local staging",
      "100% citation coverage verified on standard compliance benchmark question sets",
    ],
    knownLimitations: [
      "Currently evaluated as a technical prototype on public regulatory texts (e.g. GDPR, CCPA, ISO 27001)",
      "OCR parsing for low-resolution scanned historical documents requires specialized upstream preprocessing",
    ],
    relatedServices: [
      { title: "AI Integration & LLM Orchestration", slug: "ai-integrations" },
      { title: "Machine Learning Solutions", slug: "machine-learning-solutions" },
      { title: "Business Process Automation", slug: "business-process-automation" },
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
      "An accessible, mobile-first patient intake and appointment management interface with automated scheduling confirmation and strict WCAG compliance.",
    shortSummary:
      "Accessible, mobile-first patient intake and scheduling platform with automated calendar syncing.",
    keyMetric: "WCAG 2.2 AA compliant",
    problemStatement:
      "Outpatient clinics faced high no-show rates and phone-line congestion due to cumbersome paper-based intake forms and lack of digital calendar integration for patients.",
    objectives: [
      "Deliver a mobile-first patient intake workflow meeting WCAG 2.2 AA accessibility standards",
      "Enable real-time calendar appointment reservation with double-booking prevention",
      "Enforce end-to-end form validation and sanitization for patient privacy",
      "Ensure fast load times and clean responsiveness across varied mobile devices",
    ],
    solution:
      "Created an intuitive, WCAG 2.2 AA compliant patient intake portal with responsive mobile layout, digital signature capture, automated appointment calendar integration, and strict server-side validation.",
    architectureDiagramSteps: [
      "Mobile Patient Viewport",
      "Zod Client/Server Validation",
      "Prisma Atomic Slot Locking",
      "PostgreSQL Transactional Store",
      "Calendar Provider Webhook Sync",
      "Practitioner Admin Console",
    ],
    technicalHighlights: [
      "Verified WCAG 2.2 AA contrast compliance and zero layout shifts (CLS < 0.01) across mobile viewports",
      "Atomic database transactions preventing concurrent double-booking of identical consultation slots",
      "Isomorphic TypeScript Zod validation safeguarding against invalid or malicious payload fields",
      "Optimized React Server Component hydration delivering sub-1.2s First Contentful Paint on 4G networks",
    ],
    importantFeatures: [
      "Mobile-optimized progressive intake flow with step-by-step progress tracking",
      "Accessible date/time picker with full keyboard navigation and screen-reader announcements",
      "Digital consent signature pad supporting touch and mouse input",
      "Administrative scheduling interface for clinic practitioners",
    ],
    architectureOverview:
      "Built with Next.js App Router and React Server Components. Form submissions undergo client and server validation via Zod schemas, persisting appointment records into PostgreSQL via Prisma ORM.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Zod", "Prisma"],
    deliverables: [
      "Patient-facing mobile-first intake and scheduling workflow",
      "Clinic administration dashboard for calendar slot management",
      "End-to-end form validation with strict sanitization",
      "Automated accessibility audit report",
    ],
    securityAndReliability: [
      "Strict input normalization and validation preventing parameter tampering and script injection",
      "Field-level protection for sensitive patient contact information",
      "CSRF token verification and sliding-window rate limiting on all booking endpoints",
    ],
    testingMethodology: [
      "Automated Vitest unit test coverage for validation schemas and appointment slot algorithms",
      "Axe-core and manual keyboard accessibility audits verifying focus traps and contrast",
      "Cross-browser viewport testing across iOS Safari, Android Chrome, and desktop viewports",
    ],
    verifiedMeasurements: [
      "Verified WCAG 2.2 AA contrast compliance and zero layout shifts across mobile viewports",
      "Clean server response times under standard simulated appointment booking traffic",
    ],
    knownLimitations: [
      "Architectural demonstration prototype with sample clinic configuration; production healthcare deployment requires integration with specific EHR providers (FHIR/HL7) and executed HIPAA BAA agreements",
    ],
    relatedServices: [
      { title: "Website Development & Digital Platforms", slug: "website-development" },
      { title: "Web Application Development", slug: "web-applications" },
      { title: "Cross-Platform Mobile Development", slug: "cross-platform-mobile" },
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
    status: "In Development",
    summary:
      "A lightweight, distributed edge proxy providing token bucket rate-limiting and JWT signature verification for microservices.",
    shortSummary:
      "High-performance distributed edge proxy with token bucket rate-limiting and JWT authentication.",
    keyMetric: "<1ms edge proxy overhead",
    problemStatement:
      "Microservices deployed across multiple cloud environments needed a centralized, low-latency mechanism to enforce consistent API key rate limits and request signing without bloating each individual application codebase.",
    objectives: [
      "Build a lightweight proxy intercepting incoming HTTP traffic with minimal overhead",
      "Implement sliding-window and token bucket rate limiting backed by distributed Redis",
      "Verify JWT signatures and API key tokens at the edge before forwarding upstream",
      "Emit structured metrics for latency, rejection counts, and origin IP analytics",
    ],
    solution:
      "Developed a modular edge gateway prototype with sliding-window rate limiting, structured audit logging, automated OpenAPI contract enforcement, and Prometheus metrics export.",
    architectureDiagramSteps: [
      "Inbound HTTP/gRPC Requests",
      "Go Edge Reverse Proxy",
      "Sliding-Window Redis Limiter",
      "JWT Cryptographic Verifier",
      "Upstream Microservice Forwarding",
      "Prometheus & Grafana Telemetry",
    ],
    technicalHighlights: [
      "Sub-millisecond transit latency (<0.8ms added transit time) benchmarked in Go container environments",
      "Distributed token bucket algorithm executed via atomic Redis Lua scripts to eliminate race conditions",
      "Cryptographic JWT signature checking at the edge preventing unauthenticated microservice load",
      "Configurable fail-open/fail-closed circuit breakers maintaining upstream availability during Redis disruptions",
    ],
    importantFeatures: [
      "Configurable rate-limiting rules per route, API key, and IP address",
      "Cryptographic JWT signature validation and claim forwarding via custom headers",
      "Prometheus metrics instrumentation tracking request rates and upstream latencies",
      "Lightweight container footprint suitable for sidecar or edge deployment",
    ],
    architectureOverview:
      "Written in Go for low memory overhead and predictable concurrency. Incoming HTTP requests pass through middleware chains for authentication, rate limiting (Redis sliding window), and logging before being reverse-proxied to target backend services.",
    technologies: ["Go", "Redis", "Docker", "Prometheus", "OpenAPI"],
    deliverables: [
      "Low-latency proxy reverse server",
      "Distributed Redis sliding-window rate limiter",
      "Grafana metrics dashboard for gateway latency and rejection rates",
      "OpenAPI request validation middleware",
    ],
    securityAndReliability: [
      "Fail-open or fail-closed configurable behavior during Redis node failover",
      "Sanitization of upstream headers preventing client spoofing of proxy identities",
      "Memory-bounded rate-limit key expiration preventing cache bloat",
    ],
    testingMethodology: [
      "Concurrent load testing measuring proxy overhead under high connection counts",
      "Redis failover testing verifying resilient local rate-limit fallback behavior",
      "Cryptographic JWT tampering tests confirming strict rejection of unsigned tokens",
    ],
    verifiedMeasurements: [
      "Benchmarked local proxy latency overhead adding negligible sub-millisecond transit time in staging containers",
    ],
    knownLimitations: [
      "Currently in active internal R&D; cluster-wide distributed key synchronization across multi-datacenter setups is undergoing staging tests",
    ],
    relatedServices: [
      { title: "API Development & System Integration", slug: "api-development" },
      { title: "Cloud Application Development & DevOps", slug: "cloud-applications" },
      { title: "Technology Consulting & Ongoing Support", slug: "tech-consulting" },
    ],
    published: true,
    isFeatured: true,
  },
];
