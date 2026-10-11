export interface CoreValue {
  title: string;
  description: string;
}

export interface LeadershipPrinciple {
  title: string;
  subtitle: string;
  description: string;
  practicePoints: string[];
}

export const coreValues: CoreValue[] = [
  {
    title: "Engineering Excellence",
    description:
      "We build systems with high technical standards: strict type-safety, clean modular architecture, automated test coverage, and transparent documentation.",
  },
  {
    title: "Practical Innovation",
    description:
      "We value proven utility over hype. Every technology choice, whether AI model or database engine, must solve a real business challenge reliably.",
  },
  {
    title: "Integrity & Data Responsibility",
    description:
      "We treat client data, user privacy, and system security as non-negotiable responsibilities, rejecting opaque shortcuts and deceptive claims.",
  },
  {
    title: "Continuous Learning",
    description:
      "Technology evolves rapidly. We foster a culture of active research, paired engineering, and continuous skill refinement for students and staff alike.",
  },
  {
    title: "Radical Collaboration",
    description:
      "Software flourishes when business stakeholders, seasoned industry mentors, and energetic student developers communicate openly without friction.",
  },
  {
    title: "Responsible Technology",
    description:
      "We design accessible, efficient digital solutions that respect resource budgets, user privacy rights, and WCAG accessibility standards.",
  },
];

/**
 * Engineering Leadership Principles
 * Replaces unverified personal profiles with verified operational and architectural leadership standards.
 */
export const leadershipPrinciples: LeadershipPrinciple[] = [
  {
    title: "Systems Architecture & Code Craftsmanship",
    subtitle: "Modular, typed, test-driven engineering discipline",
    description:
      "We architect systems with clear domain boundaries, immutable state interfaces, and automated verification. Every component is designed for long-term maintainability rather than short-term expediency.",
    practicePoints: [
      "Strict end-to-end TypeScript type-safety across client and server boundaries",
      "Automated CI regression gates and integration test pipelines on every commit",
      "Modular service decoupling designed for graceful horizontal scalability",
    ],
  },
  {
    title: "Applied AI & Data Responsibility",
    subtitle: "Utility-first machine learning and private inference",
    description:
      "We deploy AI models that ground answers in verifiable source documents, avoiding hallucinations and strictly maintaining data privacy boundaries without external leakage.",
    practicePoints: [
      "Retrieval-Augmented Generation (RAG) with precise chunk-level source provenance",
      "Air-gapped and private VPC vector search index deployment options",
      "Continuous evaluation pipelines measuring precision, latency, and token consumption",
    ],
  },
  {
    title: "Technical Apprenticeship & Mentorship",
    subtitle: "Bridging academic theory and production software craftsmanship",
    description:
      "We pair emerging engineers with seasoned industry mentors to work through real specifications, thorough pull request reviews, and production deployment workflows.",
    practicePoints: [
      "Direct paired programming and architecture walkthroughs with senior technologists",
      "Rigorous git branch review standards cultivating professional development hygiene",
      "Publicly demonstrable, verifiable capstone portfolio deliverables",
    ],
  },
];
