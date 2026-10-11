export interface IndustrySolution {
  id: string;
  name: string;
  headline: string;
  description: string;
  challenges: string[];
  solutions: string[];
  keyTechnologies: string[];
  complianceNotice?: string;
}

export const industriesData: IndustrySolution[] = [
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    headline: "Secure, compliant data pipelines and patient-facing applications.",
    description:
      "We build reliable technological foundations for clinical workflows, telemedicine systems, and medical analytics while placing privacy and security at the core.",
    challenges: [
      "Stringent health information privacy and audit trail requirements",
      "Interoperability across disparate electronic health record (EHR) standards",
      "Zero-tolerance requirement for downtime in clinical decision-support tools",
    ],
    solutions: [
      "Role-based access control (RBAC) with tamper-evident audit logging",
      "FHIR and HL7 data standard mapping and integration services",
      "Isolated database encryption at rest and in transit with field-level hashing",
    ],
    keyTechnologies: ["FHIR", "PostgreSQL (Encrypted)", "Docker", "Node.js", "TypeScript"],
    complianceNotice:
      "Important Notice: Production healthcare implementations require comprehensive legal, HIPAA / GDPR compliance, and independent security assessments before deployment with real patient data. We configure compliant architecture patterns and assist during third-party audit readiness.",
  },
  {
    id: "education",
    name: "Education & EdTech",
    headline: "Interactive learning platforms, student management, and assessment engines.",
    description:
      "Empowering institutions and EdTech pioneers with real-time collaborative workspaces, adaptive quizzes, and administrative portals.",
    challenges: [
      "Handling massive concurrent traffic spikes during exam windows",
      "Supporting varied student bandwidth and device capabilities",
      "Keeping students actively engaged through responsive UI interactions",
    ],
    solutions: [
      "Scalable serverless backends that automatically scale during peak hours",
      "Progressive Web App (PWA) offline-first caching for low-bandwidth environments",
      "Interactive assessment components with real-time feedback loops",
    ],
    keyTechnologies: ["Next.js", "WebSockets", "Tailwind CSS", "PostgreSQL", "Redis"],
  },
  {
    id: "retail-commerce",
    name: "Retail & E-Commerce",
    headline: "Fast storefronts, omnichannel inventory management, and automated fulfillment.",
    description:
      "We design lightning-fast headless e-commerce stores, custom checkout workflows, and unified stock synchronization across physical and digital channels.",
    challenges: [
      "Slow page rendering leading to dropped conversions and lost revenue",
      "Inventory discrepancies across multiple selling channels and marketplaces",
      "Complex promotional logic and multi-tier pricing structures",
    ],
    solutions: [
      "Edge-rendered product catalogs with optimized, low-latency page transitions",
      "Event-driven inventory synchronization using webhook queues",
      "Flexible cart and discount engines supporting dynamic rule evaluation",
    ],
    keyTechnologies: ["Next.js", "Stripe API", "GraphQL", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "professional-services",
    name: "Professional & Legal Services",
    headline: "Confidential document portals, client billing, and workflow automation.",
    description:
      "Helping legal, accounting, and consulting firms streamline client intake, document exchange, and project milestone billing.",
    challenges: [
      "Securing confidential client documents with strict permission boundaries",
      "Manual time tracking and repetitive invoice generation",
      "Fragmented email threads for document revision approvals",
    ],
    solutions: [
      "Encrypted client portals with granular folder and file access controls",
      "Automated time-tracking integrations and customized PDF billing pipelines",
      "Versioned document sign-off workflows with verifiable timestamps",
    ],
    keyTechnologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "logistics",
    name: "Logistics & Supply Chain",
    headline: "Dispatch tracking, warehouse management, and shipment visibility.",
    description:
      "Real-time operational dashboards, shipment event tracking, and barcode-ready mobile applications for dispatchers and warehouse personnel.",
    challenges: [
      "Lack of real-time visibility into transit milestones and delays",
      "Manual paperwork slowing down dock receiving and dispatching",
      "Spotty connectivity in warehouses and distribution centers",
    ],
    solutions: [
      "Telemetry-backed tracking interfaces with status mapping",
      "Mobile-optimized web apps supporting camera-based barcode scanning",
      "Offline sync queues ensuring workers can input data without active Wi-Fi",
    ],
    keyTechnologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    id: "startups-smb",
    name: "Startups & Emerging Ventures",
    headline: "Rapid MVP engineering, scalable foundations, and investor-ready architecture.",
    description:
      "We turn visionary product concepts into production-grade MVPs, engineered with the architectural rigor required to scale upon funding.",
    challenges: [
      "Limited runway requiring disciplined feature prioritization",
      "Balancing speed to market with long-term code quality and security",
      "Preparing technical infrastructure for future investor due diligence",
    ],
    solutions: [
      "Laser-focused MVP scoping focusing on the core value proposition",
      "Modern, battle-tested tech stacks that avoid proprietary lock-in",
      "Clean architecture with comprehensive documentation and automated tests",
    ],
    keyTechnologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
  },
];
