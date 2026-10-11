import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialOpportunities = [
  {
    id: "fullstack-internship-2026",
    slug: "fullstack-software-engineering-intern",
    title: "Full-Stack Software Engineering Intern",
    department: "Backend Engineering",
    type: "TECHNICAL_INTERNSHIP" as const,
    description:
      "Work alongside senior engineering mentors to build, test, and deploy production-grade web services, API endpoints, and responsive user interfaces.",
    eligibility:
      "Current undergraduate/graduate students in Computer Science, Software Engineering, or related fields, or self-taught developers with demonstrated portfolio projects.",
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "PostgreSQL",
      "Git",
      "REST APIs",
    ],
    duration: "12 Weeks (Flexible: 15–20 hours / week)",
    locationMode: "Remote (Global)",
    compensationStatus: "Educational / Project Stipend Evaluated per Cohort",
    deadline: "Rolling Admissions for 2026/2027 Cohorts",
    availablePositions: 4,
    published: true,
  },
  {
    id: "ai-ml-internship-2026",
    slug: "ai-applied-machine-learning-intern",
    title: "Applied AI & Data Systems Intern",
    department: "AI & Machine Learning",
    type: "TECHNICAL_INTERNSHIP" as const,
    description:
      "Design, implement, and benchmark domain-specific RAG pipelines, LLM agent interfaces, and automated data processing workflows.",
    eligibility:
      "Students or recent graduates with strong foundations in Python, mathematical reasoning, data structures, and foundational neural network concepts.",
    skills: [
      "Python 3.11+",
      "FastAPI",
      "Vector Databases",
      "LangChain / LlamaIndex",
      "Prompt Architecture",
    ],
    duration: "14 Weeks (Flexible: 15–20 hours / week)",
    locationMode: "Remote (Global)",
    compensationStatus: "Educational / Project Stipend Evaluated per Cohort",
    deadline: "Rolling Admissions for 2026/2027 Cohorts",
    availablePositions: 2,
    published: true,
  },
  {
    id: "qa-systems-internship-2026",
    slug: "quality-assurance-automation-intern",
    title: "QA Automation & Reliability Engineering Intern",
    department: "QA & Automation",
    type: "PROJECT_APPRENTICESHIP" as const,
    description:
      "Construct comprehensive automated end-to-end testing frameworks, API performance verification suites, and CI/CD validation pipelines.",
    eligibility:
      "Engineering students or early-career QA analysts passionate about software reliability, bug reproduction, and automated validation tooling.",
    skills: [
      "JavaScript / TypeScript",
      "Playwright / Cypress",
      "Vitest / Jest",
      "GitHub Actions CI/CD",
      "HTTP / API Testing",
    ],
    duration: "10 Weeks (Flexible: 15–20 hours / week)",
    locationMode: "Remote (Global)",
    compensationStatus: "Unpaid Industry Experience (Academic Credit Eligible)",
    deadline: "Rolling Admissions for 2026/2027 Cohorts",
    availablePositions: 3,
    published: true,
  },
];

const initialProjects = [
  {
    id: "sentinel-analytics",
    slug: "sentinel-analytics",
    title: "Sentinel Fleet Telemetry Platform",
    category: "Enterprise Software",
    status: "DEMONSTRATION" as const,
    summary:
      "A real-time telemetry streaming and fleet health monitoring architecture designed for high-frequency sensor data processing.",
    problemStatement:
      "Distributed logistics fleets produce hundreds of sensor telemetry events per second. Legacy reporting engines struggled with ingestion lag, preventing timely fleet oversight.",
    solution:
      "Architected an event-driven ingestion pipeline utilizing lightweight message brokers, timeseries aggregation, and an interactive real-time dashboard with dynamic alerting.",
    technologies: ["TypeScript", "Node.js", "WebSockets", "TimescaleDB", "Tailwind CSS", "Docker"],
    published: true,
    demoUrl: "/projects/sentinel-analytics",
  },
  {
    id: "aegis-rag-engine",
    slug: "aegis-rag-engine",
    title: "Aegis Enterprise Document Intelligence",
    category: "AI & Automation",
    status: "PROTOTYPE" as const,
    summary:
      "A privacy-preserving document synthesis and semantic search engine for dense regulatory and compliance filings.",
    problemStatement:
      "Legal and compliance teams spent excessive hours manually cross-referencing multi-hundred-page policy documents across conflicting international guidelines.",
    solution:
      "Engineered an air-gapped Retrieval-Augmented Generation (RAG) prototype with local vector embeddings, chunk-level provenance citations, and zero external network leakage.",
    technologies: ["Python", "FastAPI", "Qdrant", "LangChain", "Next.js", "Tailwind CSS"],
    published: true,
    demoUrl: "/projects/aegis-rag-engine",
  },
  {
    id: "pulse-telehealth",
    slug: "pulse-telehealth",
    title: "Pulse Mobile Patient Care Coordinator",
    category: "Web & Mobile",
    status: "COMPLETED" as const,
    summary:
      "A HIPAA-compliant asynchronous consultation and vitals tracking application designed for specialty clinics.",
    problemStatement:
      "Specialty outpatient clinics faced a 28% patient drop-off rate between appointments due to friction in manual appointment scheduling and fragmented test result distribution.",
    solution:
      "Delivered a cross-platform mobile application featuring end-to-end encrypted messaging, automated medication reminders, and bi-directional FHIR-compliant EHR synchronization.",
    technologies: ["React Native", "TypeScript", "Node.js", "PostgreSQL", "WebRTC", "Docker"],
    published: true,
    demoUrl: "/projects/pulse-telehealth",
  },
  {
    id: "veritas-audit-engine",
    slug: "veritas-audit-engine",
    title: "Veritas Automated Cloud Security Compliance",
    category: "Internal R&D",
    status: "WORK_IN_PROGRESS" as const,
    summary:
      "An automated configuration drift detection engine scanning multi-cloud infrastructure against SOC2 and ISO27001 control matrices.",
    problemStatement:
      "Fast-moving product teams frequently deploy ephemeral cloud infrastructure that drifts from corporate security baselines without detection until quarterly audits.",
    solution:
      "Developing an agentless periodic audit scanner that correlates AWS, GCP, and Azure resource graphs against compliance standards with automated remediation playbooks.",
    technologies: ["Go", "Open Policy Agent", "Terraform", "PostgreSQL", "Next.js", "Tailwind CSS"],
    published: true,
    demoUrl: "/projects/veritas-audit-engine",
  },
];

async function main() {
  console.log("Seeding database initial records...");

  for (const opp of initialOpportunities) {
    await prisma.internshipOpportunity.upsert({
      where: { slug: opp.slug },
      update: opp,
      create: opp,
    });
    console.log(`Upserted internship opportunity: ${opp.title}`);
  }

  for (const proj of initialProjects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
    console.log(`Upserted project: ${proj.title}`);
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Database seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
