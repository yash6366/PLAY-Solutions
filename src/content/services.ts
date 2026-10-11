export interface ServiceFAQ {
  question: string;
  answer: string;
}

export type ServiceCategory =
  | "Custom Software Engineering"
  | "Web and Mobile Development"
  | "AI and Intelligent Automation"
  | "Cloud, DevOps and Quality Engineering"
  | "Technology Consulting";

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  overview: string;
  problemsAddressed: string[];
  proposedApproach: string[];
  deliverables: string[];
  technologies: string[];
  engagementProcess: string[];
  faq: ServiceFAQ[];
  isFeaturedHomepage?: boolean;
}

export const servicesData: ServiceDetail[] = [
  {
    id: "custom-software",
    slug: "custom-software",
    title: "Custom Software Development",
    category: "Custom Software Engineering",
    shortDescription: "Tailored enterprise software designed for specialized workflows, operational efficiency, and scalable growth.",
    overview: "We architect and engineer bespoke software systems that map accurately to your organization's unique operational needs, eliminating manual overhead and disparate software silos.",
    problemsAddressed: [
      "Off-the-shelf software failing to match specific internal business logic",
      "Siloed legacy systems that do not integrate with modern data stores",
      "Manual bottlenecks and high error rates in mission-critical operations",
      "Inability to scale software infrastructure with transaction growth",
    ],
    proposedApproach: [
      "Rigorous domain modeling and technical requirement decomposition",
      "Modular microservice or domain-driven monolithic system design",
      "Iterative sprint-based delivery with continuous integration pipelines",
      "Zero-downtime deployment strategies and robust telemetry monitoring",
    ],
    deliverables: [
      "Production-ready backend services and domain logic modules",
      "Documented REST and GraphQL API specifications",
      "Automated test suites (unit, integration, regression)",
      "Infrastructure-as-code deployment scripts and technical architecture diagrams",
    ],
    technologies: ["TypeScript", "Node.js", "Python", "Go", "PostgreSQL", "Docker", "Redis"],
    engagementProcess: [
      "1. Architectural Discovery & Scope Definition",
      "2. Prototype & Proof of Concept Validation",
      "3. Core Engineering & Bi-Weekly Milestone Reviews",
      "4. Quality Assurance, Security Audit & Deployment",
      "5. Transition & Knowledge Transfer",
    ],
    faq: [
      {
        question: "How do you handle intellectual property and source code ownership?",
        answer: "All custom source code, documentation, and intellectual assets developed under the agreement are 100% owned by the client upon project completion.",
      },
      {
        question: "Can you modernize an existing legacy code repository?",
        answer: "Yes. We perform legacy code audits, incremental refactoring, and database migration strategies that minimize operational disruption.",
      },
    ],
    isFeaturedHomepage: true,
  },
  {
    id: "website-development",
    slug: "website-development",
    title: "Website Development & Digital Platforms",
    category: "Web and Mobile Development",
    shortDescription: "High-performance digital platforms, marketing websites, and Jamstack architectures optimized for Core Web Vitals.",
    overview: "We craft modern, responsive, and accessible web experiences that engage visitors, showcase your services, and achieve perfect Core Web Vitals performance.",
    problemsAddressed: [
      "High bounce rates driven by slow initial page loads and unoptimized assets",
      "Poor search engine indexing resulting from client-side only rendering",
      "Inaccessible markup failing WCAG contrast and keyboard navigation tests",
      "Rigid CMS templates that restrict editorial agility and developer velocity",
    ],
    proposedApproach: [
      "Static site generation (SSG) with incremental static regeneration (ISR)",
      "Headless CMS integration with structured content modeling",
      "Responsive layout engineering across 320px to 4K display viewports",
      "Strict semantic HTML structure and automated Lighthouse optimization",
    ],
    deliverables: [
      "Fully responsive production website deployment",
      "Configurable CMS integration and editorial publishing runbooks",
      "Open Graph metadata, sitemap.xml, and schema.org structured data",
      "Core Web Vitals compliance audit report",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "HTML5"],
    engagementProcess: [
      "1. UX Wireframing & Responsive Art Direction",
      "2. Component System Engineering & Token Architecture",
      "3. Content Ingestion & CMS Integration",
      "4. Cross-Browser Testing & Speed Optimization",
      "5. Production DNS Cutover & Telemetry",
    ],
    faq: [
      {
        question: "How do you optimize for search engines (SEO)?",
        answer: "We engineer server-rendered metadata, dynamic sitemaps, structured JSON-LD schemas, canonical URLs, and clean semantic heading structures.",
      },
    ],
  },
  {
    id: "web-applications",
    slug: "web-applications",
    title: "Web Application Development",
    category: "Web and Mobile Development",
    shortDescription: "Interactive SaaS portals, administrative dashboards, and customer-facing web apps with real-time state.",
    overview: "From multi-tenant SaaS products and analytics dashboards to collaborative customer workspaces, we engineer responsive, secure web applications.",
    problemsAddressed: [
      "Complex business logic bogging down frontend rendering",
      "State synchronization conflicts during concurrent user interactions",
      "Inadequate access control leading to security vulnerabilities",
      "Poor responsiveness across mobile and tablet browsers",
    ],
    proposedApproach: [
      "Server-side rendering and edge routing for responsive user flows",
      "Granular role-based access control (RBAC) and JWT/session management",
      "Optimistic UI updates with resilient fallback synchronization",
      "Component-driven design systems with reusable atomic UI blocks",
    ],
    deliverables: [
      "Full-stack Web Application with secure authentication",
      "Interactive data dashboards and management interfaces",
      "Role-based permission layer and activity logging",
      "Comprehensive Playwright and Vitest test suites",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    engagementProcess: [
      "1. User Journey Mapping & Architecture Specification",
      "2. State Flow Design & API Contract Modeling",
      "3. Component Sprint Delivery & Milestone Verification",
      "4. Security Penetration & Load Testing",
      "5. Production Handover & Deployment",
    ],
    faq: [
      {
        question: "Can the web application handle real-time multi-user updates?",
        answer: "Yes, we integrate WebSockets and event streams for real-time messaging, status sync, and telemetry updates.",
      },
    ],
    isFeaturedHomepage: true,
  },
  {
    id: "android-development",
    slug: "android-development",
    title: "Native Android Application Development",
    category: "Web and Mobile Development",
    shortDescription: "High-performance native Android applications built with Kotlin and Jetpack Compose.",
    overview: "We build intuitive, fluid native Android applications conforming to modern Material You design standards, optimized for performance across the diverse Android device ecosystem.",
    problemsAddressed: [
      "Fragmented hardware performance causing UI stutter on low-end devices",
      "High battery drain and memory leaks from unoptimized background tasks",
      "Inconsistent experience across multiple Android OS versions",
    ],
    proposedApproach: [
      "Kotlin-first engineering using Jetpack Compose declarative UI",
      "Clean architecture with Coroutines and StateFlow for concurrency",
      "Offline-first local caching using Room database",
      "Automated UI testing using AndroidX Espresso and Compose testing",
    ],
    deliverables: [
      "Production-ready signed Android App Bundle (.aab)",
      "Material Design 3 component suite",
      "Google Play Store submission assets and compliance documentation",
      "Unit and UI test reports",
    ],
    technologies: ["Kotlin", "Jetpack Compose", "Coroutines", "Room DB", "Retrofit", "Gradle"],
    engagementProcess: [
      "1. Mobile Wireframing & UX Architecture",
      "2. Native Android Module Implementation",
      "3. API Integration & Offline State Management",
      "4. Device Farm Compatibility Testing",
      "5. Google Play Internal Track & Production Release",
    ],
    faq: [
      {
        question: "Do you support offline functionality for Android apps?",
        answer: "Yes, we architect Room local SQLite caching with background WorkManager synchronization for reliable offline-first experiences.",
      },
    ],
  },
  {
    id: "ios-development",
    slug: "ios-development",
    title: "Native iOS Application Development",
    category: "Web and Mobile Development",
    shortDescription: "Elegant, fluid iOS applications engineered with Swift, SwiftUI, and Apple Human Interface Guidelines.",
    overview: "We craft native iOS experiences that look and feel completely at home on Apple devices, emphasizing silky smooth 120Hz ProMotion rendering, privacy, and delightful interactions.",
    problemsAddressed: [
      "Suboptimal performance and jank from generic cross-platform wrappers",
      "Rejection risks during rigorous Apple App Store review cycles",
      "Inability to leverage native iOS hardware features like FaceID or CoreML",
    ],
    proposedApproach: [
      "SwiftUI and Swift Concurrency (async/await) architectural patterns",
      "Strict conformance to Apple Human Interface Guidelines (HIG)",
      "Secure Keychain storage and biometric authentication integration",
      "App Store Guidelines pre-flight compliance verification",
    ],
    deliverables: [
      "Production iOS Xcode project and archive",
      "SwiftUI component library and dynamic typography tokens",
      "TestFlight distribution setup and App Store Connect configuration",
      "Automated XCTest test suite",
    ],
    technologies: ["Swift", "SwiftUI", "Combine", "SwiftData", "Xcode", "TestFlight"],
    engagementProcess: [
      "1. Human Interface Guidelines Architecture",
      "2. Native SwiftUI Prototyping",
      "3. Native Device Hardware & API Integration",
      "4. TestFlight Beta Cohort Feedback",
      "5. App Store Submission & Launch Approval",
    ],
    faq: [
      {
        question: "Can your iOS apps integrate with Apple Pay and FaceID?",
        answer: "Yes, we implement native LocalAuthentication biometrics and PassKit Apple Pay flows with complete security.",
      },
    ],
  },
  {
    id: "cross-platform-mobile",
    slug: "cross-platform-mobile",
    title: "Cross-Platform Mobile Development",
    category: "Web and Mobile Development",
    shortDescription: "Unified mobile applications for iOS and Android using React Native and Flutter with a single codebase.",
    overview: "Accelerate time to market and reduce engineering overhead with unified mobile apps that deliver near-native 60fps performance across both operating systems.",
    problemsAddressed: [
      "Maintaining two disparate native teams multiplying development budgets",
      "Feature desynchronization between iOS and Android release cycles",
      "Lengthy turnaround times for urgent bug fixes and updates",
    ],
    proposedApproach: [
      "Unified TypeScript/Dart shared business logic and state architecture",
      "Platform-specific UI adaptation where native conventions diverge",
      "Over-the-air (OTA) update pipelines for rapid patch distribution",
      "Native bridge optimization avoiding serialization bottlenecks",
    ],
    deliverables: [
      "Dual iOS and Android builds from a single codebase",
      "Shared business logic and API client libraries",
      "Automated CI/CD pipeline building both platform binaries",
      "Comprehensive cross-device smoke test results",
    ],
    technologies: ["React Native", "Flutter", "TypeScript", "Expo", "Dart", "Tailwind"],
    engagementProcess: [
      "1. Cross-Platform Feasibility & Technical Scoping",
      "2. Shared Component Architecture & Prototyping",
      "3. Core Feature Sprints & Native Bridge Binding",
      "4. Dual-Platform Emulation & Hardware Testing",
      "5. Simultaneous App Store & Google Play Rollout",
    ],
    faq: [
      {
        question: "When should we choose cross-platform over native?",
        answer: "Cross-platform is ideal when you need rapid market entry with consistent features on both iOS and Android while optimizing engineering budgets.",
      },
    ],
  },
  {
    id: "ai-integrations",
    slug: "ai-integrations",
    title: "AI Integration & LLM Orchestration",
    category: "AI and Intelligent Automation",
    shortDescription: "Intelligent automation, machine learning integration, and LLM orchestration built for enterprise utility.",
    overview: "We bridge cutting-edge artificial intelligence models with practical business operations, delivering reliable, verifiable AI capabilities that respect data boundaries.",
    problemsAddressed: [
      "Generic chatbots that hallucinate and lack internal enterprise context",
      "Unstructured document processing requiring excessive human hours",
      "Data privacy concerns when interacting with third-party foundation models",
      "Difficulty operationalizing machine learning prototypes into production",
    ],
    proposedApproach: [
      "Retrieval-Augmented Generation (RAG) using curated vector databases",
      "Strict data sanitization and privacy isolation layers",
      "Model evaluation pipelines measuring accuracy, latency, and token consumption",
      "Human-in-the-loop review mechanisms for high-consequence workflows",
    ],
    deliverables: [
      "Fine-tuned or orchestrated AI inference service endpoints",
      "Vector search index and document ingestion pipelines",
      "Guardrail enforcement layer preventing prompt injection & data exfiltration",
      "Performance evaluation benchmark reports",
    ],
    technologies: ["Python", "PyTorch", "LangChain", "OpenAI / Anthropic APIs", "Qdrant", "PostgreSQL pgvector"],
    engagementProcess: [
      "1. Feasibility Study & Data Privacy Assessment",
      "2. Proof of Concept with Domain-Specific Data",
      "3. Pipeline Architecture & Guardrail Configuration",
      "4. Integration with Core Applications & User Testing",
      "5. Telemetry, Monitoring & Continual Model Evaluation",
    ],
    faq: [
      {
        question: "Is our proprietary company data used to train public AI models?",
        answer: "Never. We enforce zero-retention enterprise API configurations and secure self-hosted or private VPC vector embeddings to guarantee complete data confidentiality.",
      },
      {
        question: "How do you prevent hallucinations in automated AI workflows?",
        answer: "We implement grounded retrieval schemas (RAG), strict prompt constraint layers, source citation verification, and deterministic rule validation.",
      },
    ],
    isFeaturedHomepage: true,
  },
  {
    id: "machine-learning-solutions",
    slug: "machine-learning-solutions",
    title: "Machine Learning Solutions & Predictive Models",
    category: "AI and Intelligent Automation",
    shortDescription: "Custom predictive models, classification systems, anomaly detection, and time-series forecasting pipelines.",
    overview: "We design, train, and deploy statistical and deep learning models that transform operational telemetry and historical data into actionable business predictions.",
    problemsAddressed: [
      "Inability to anticipate customer churn or inventory depletion",
      "Manual anomaly detection failing on high-frequency transaction data",
      "Models degrading over time due to unmonitored concept and data drift",
    ],
    proposedApproach: [
      "Exploratory data analysis, feature engineering, and class imbalance mitigation",
      "Rigorous cross-validation against baseline heuristic models",
      "Model containerization with sub-100ms inference endpoints",
      "Continuous drift monitoring and automated retraining pipelines",
    ],
    deliverables: [
      "Trained model artifacts with reproducible training notebooks",
      "Low-latency REST / gRPC inference microservices",
      "Automated feature extraction and ETL pipeline",
      "Model performance, ROC-AUC, and F1-score evaluation report",
    ],
    technologies: ["Python", "scikit-learn", "PyTorch", "XGBoost", "Pandas", "MLflow", "Docker"],
    engagementProcess: [
      "1. Data Audit & Predictive Target Formulation",
      "2. Feature Engineering & Model Selection",
      "3. Offline Validation & Hyperparameter Optimization",
      "4. Containerized Microservice Deployment",
      "5. Production Monitoring & Retraining Triggers",
    ],
    faq: [
      {
        question: "How do you monitor for model drift in production?",
        answer: "We log input feature distributions and prediction confidence scores, triggering alerts when statistical deviation exceeds defined thresholds.",
      },
    ],
  },
  {
    id: "business-process-automation",
    slug: "business-process-automation",
    title: "Business Process Automation & Workflows",
    category: "AI and Intelligent Automation",
    shortDescription: "Event-driven workflow engines, automated data reconciliation, and document parsing eliminating manual tasks.",
    overview: "Free your team from repetitive manual operations. We engineer robust, audit-logged automation pipelines that connect your CRM, accounting, and operational systems.",
    problemsAddressed: [
      "Labor-intensive manual data entry across disparate software tools",
      "Data entry human errors leading to financial and fulfillment discrepancies",
      "Lack of structured audit logging when cross-platform events occur",
    ],
    proposedApproach: [
      "Event-driven webhook queues with exponential backoff retries",
      "Idempotent task execution preventing duplicate transaction processing",
      "OCR and document parsing pipelines extracting structured records",
      "Centralized logging dashboards tracking execution health and SLAs",
    ],
    deliverables: [
      "Resilient background worker services and queues",
      "Bi-directional synchronization connectors between internal tools",
      "Dead-letter queue monitoring and alert notifications",
      "Process documentation and runbooks",
    ],
    technologies: ["Node.js", "Python", "Temporal / BullMQ", "Redis", "PostgreSQL", "Webhooks"],
    engagementProcess: [
      "1. Workflow Bottleneck Mapping & Opportunity Sizing",
      "2. Connector Architecture & Idempotency Specification",
      "3. Automated Pipeline Implementation & Staging Runs",
      "4. Exception Handling & Alert Gate Verification",
      "5. Production Cutover & Team Training",
    ],
    faq: [
      {
        question: "What happens if a third-party service is temporarily down?",
        answer: "Our pipelines use exponential backoff retries with dead-letter queues, ensuring zero data loss and automated recovery once the service resumes.",
      },
    ],
  },
  {
    id: "database-engineering",
    slug: "database-engineering",
    title: "Database Engineering & Optimization",
    category: "Cloud, DevOps and Quality Engineering",
    shortDescription: "Relational and document database schema design, index optimization, query tuning, and disaster recovery.",
    overview: "We design robust schemas, write efficient queries, and configure automated backups to protect data integrity and optimize throughput.",
    problemsAddressed: [
      "Slow query execution times degrading user experience",
      "Unindexed large tables causing high CPU utilization",
      "Lack of automated backup and point-in-time recovery runbooks",
    ],
    proposedApproach: [
      "Normalized relational schemas with strict foreign key constraints",
      "Query execution plan EXPLAIN analysis and composite index design",
      "Connection pooling and read-replica offloading for high traffic",
      "Automated automated snapshot schedules with tested restoration drills",
    ],
    deliverables: [
      "Database schema migrations (Prisma / Liquibase / Flyway)",
      "Index tuning plan and query optimization report",
      "Connection pooling and replication architecture blueprint",
      "Disaster recovery and backup verification runbooks",
    ],
    technologies: ["PostgreSQL", "Prisma", "MySQL", "MongoDB", "Redis", "TimescaleDB"],
    engagementProcess: [
      "1. Schema Health Audit & Query Profiling",
      "2. Index Optimization & Slow Query Refactoring",
      "3. Migration Plan Authoring & Staging Execution",
      "4. Replication & Backup Verification",
      "5. Real-time Telemetry & Performance Sign-off",
    ],
    faq: [
      {
        question: "Can you help optimize existing slow database queries?",
        answer: "Yes, we analyze execution plans, identify sequential table scans, design composite indexes, and restructure queries for maximal index hit rates.",
      },
    ],
  },
  {
    id: "api-development",
    slug: "api-development",
    title: "API Development & System Integration",
    category: "Cloud, DevOps and Quality Engineering",
    shortDescription: "Secure, versioned, and documented REST and GraphQL interfaces for seamless partner integration.",
    overview: "Clean API design connects services, powers mobile interfaces, and turns isolated databases into composable services.",
    problemsAddressed: [
      "Inconsistent API response schemas breaking mobile client builds",
      "Lack of rate limiting and security boundaries causing abuse vulnerabilities",
      "Missing interactive documentation increasing developer onboarding costs",
    ],
    proposedApproach: [
      "OpenAPI 3.0 specification-first design with strict payload schemas",
      "Semantic versioning and deprecation lifecycle headers",
      "Sliding-window token rate limiting and HMAC request authentication",
      "Automated contract testing preventing breaking changes in CI",
    ],
    deliverables: [
      "OpenAPI specifications and interactive Swagger / Redoc documentation",
      "Production-ready API microservices with telemetry instrumentation",
      "SDK generators for TypeScript and Python consumer clients",
      "Automated contract test suites",
    ],
    technologies: ["TypeScript", "Node.js", "FastAPI", "GraphQL", "OpenAPI", "Redis", "Docker"],
    engagementProcess: [
      "1. API Contract & Schema Definition",
      "2. Mock Server Prototyping & Client Alignment",
      "3. Core Service Implementation & Database Binding",
      "4. Security Testing & Rate Limit Calibration",
      "5. Production Rollout & Developer Documentation Handover",
    ],
    faq: [
      {
        question: "Do you implement rate limiting on APIs?",
        answer: "Yes, token bucket and sliding window rate limiting, HMAC request signing, and API key management are standard on all our API builds.",
      },
    ],
  },
  {
    id: "cloud-applications",
    slug: "cloud-applications",
    title: "Cloud Application Development & DevOps",
    category: "Cloud, DevOps and Quality Engineering",
    shortDescription: "Resilient serverless and containerized cloud systems with automated scaling and zero-downtime deployments.",
    overview: "We design cloud-native architectures that deliver high availability, low latency, and cost-effective resource utilization across modern cloud platforms.",
    problemsAddressed: [
      "Unpredictable traffic spikes causing server crashes and downtime",
      "Overprovisioned infrastructure resulting in excessive monthly cloud costs",
      "Manual server configurations vulnerable to drift and configuration errors",
    ],
    proposedApproach: [
      "Container orchestration using Docker with Infrastructure-as-Code",
      "Serverless edge computing for low-latency global delivery",
      "Automated auto-scaling groups and multi-availability zone redundancy",
      "Continuous deployment pipelines with automated rollback safeguards",
    ],
    deliverables: [
      "Terraform / OpenTofu Infrastructure-as-Code definitions",
      "Multi-stage Docker container build images",
      "GitHub Actions CI/CD workflows for automated deployment",
      "Centralized cloud monitoring and error alert thresholds",
    ],
    technologies: ["AWS", "Google Cloud", "Vercel", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    engagementProcess: [
      "1. Cloud Architecture Blueprint & Cost Modeling",
      "2. Infrastructure-as-Code Authoring",
      "3. Staging Deployment & Chaos Failure Testing",
      "4. Production Cutover with Zero-Downtime DNS Routing",
      "5. Handover & Runbook Documentation",
    ],
    faq: [
      {
        question: "Do you support multi-cloud deployments?",
        answer: "Yes, we architect using cloud-agnostic container standards to prevent vendor lock-in and enable smooth workload migration.",
      },
    ],
    isFeaturedHomepage: true,
  },
  {
    id: "software-testing",
    slug: "software-testing",
    title: "Software Testing & Quality Assurance",
    category: "Cloud, DevOps and Quality Engineering",
    shortDescription: "Comprehensive automated test suites spanning unit, integration, end-to-end, and performance testing.",
    overview: "We build automated test pipelines that catch regressions early, enabling your team to deploy software with confidence.",
    problemsAddressed: [
      "Regressions and defects escaping into production environments",
      "Lengthy manual regression testing cycles delaying feature rollouts",
      "Untested edge cases in mission-critical financial or compliance calculations",
    ],
    proposedApproach: [
      "Balanced test pyramid: fast unit tests, integrated service tests, and targeted E2E",
      "Automated CI test gates blocking broken pull requests before merging",
      "Synthetic test fixture generation for complex edge cases",
      "Visual regression testing ensuring layout integrity across devices",
    ],
    deliverables: [
      "Automated test suites (Vitest, Jest, Playwright)",
      "CI/CD workflow test gate configuration",
      "Code coverage reports and critical user journey test matrix",
      "QA regression testing runbook",
    ],
    technologies: ["Playwright", "Vitest", "Jest", "Cypress", "GitHub Actions", "Docker"],
    engagementProcess: [
      "1. Quality Audit & Test Strategy Design",
      "2. Fixture Setup & Unit Test Authoring",
      "3. End-to-End User Journey Automation",
      "4. CI Pipeline Integration & Threshold Enforcement",
      "5. Handover & Test Maintenance Guidelines",
    ],
    faq: [
      {
        question: "What test coverage percentage do you target?",
        answer: "We focus on high-value business logic and user journeys, typically targeting 80%+ critical path coverage.",
      },
    ],
  },
  {
    id: "tech-consulting",
    slug: "tech-consulting",
    title: "Technology Consulting & Ongoing Support",
    category: "Technology Consulting",
    shortDescription: "Architectural strategy, code audits, continuous QA, and long-term application maintenance.",
    overview: "We act as your trusted technical partner, providing strategic guidance on tech debt, architectural decisions, code quality standards, and dependable operational maintenance.",
    problemsAddressed: [
      "Accumulated technical debt slowing down feature development velocity",
      "Absence of standardized code review guidelines and automated QA",
      "Unplanned outages and lack of structured incident response procedures",
      "Uncertainty around cloud cost optimization and infrastructure scaling",
    ],
    proposedApproach: [
      "Comprehensive architectural health audits and security vulnerability scans",
      "Implementation of robust CI/CD pipelines with automated test gates",
      "Cloud resource optimization and infrastructure cost rationalization",
      "Dedicated SLA-backed maintenance and emergency patch protocols",
    ],
    deliverables: [
      "Technical Debt & Architecture Review Report",
      "Standardized Development & Deployment Runbooks",
      "Continuous Integration & Automated Test Pipeline",
      "System Uptime & Error Budget Telemetry Dashboards",
    ],
    technologies: ["GitHub Actions", "Docker", "AWS / GCP / Vercel", "Datadog", "SonarQube", "Vitest"],
    engagementProcess: [
      "1. System & Repository Audit",
      "2. Actionable Findings & Risk Mitigation Roadmap",
      "3. Pipeline Setup & Automation Rollout",
      "4. Ongoing Operational Support & Periodic Architecture Reviews",
    ],
    faq: [
      {
        question: "Can your team provide ongoing support for an application built by others?",
        answer: "Yes. We begin with a structured code and infrastructure audit, document current states, stabilize any urgent defects, and then transition into regular maintenance.",
      },
      {
        question: "What service level agreements (SLAs) do you offer?",
        answer: "We structure custom support plans ranging from business-hours tier-2 support to high-availability critical incident response.",
      },
    ],
    isFeaturedHomepage: true,
  },
];
