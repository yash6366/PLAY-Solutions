export interface CoreValue {
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  department: string;
  focusArea: string;
  isVerified: boolean;
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
 * Team Directory Configuration
 * Note: Individual public founder profiles are marked unverified until official verification is finalized.
 */
export const teamMembers: TeamMember[] = [
  {
    name: "Architectural Lead & Founder",
    role: "Principal Systems Architect",
    department: "Engineering Architecture",
    focusArea: "Distributed systems, cloud resilience, and software security",
    isVerified: false,
  },
  {
    name: "Applied AI Lead",
    role: "Senior AI & Data Engineer",
    department: "Machine Learning Solutions",
    focusArea: "Retrieval-Augmented Generation, vector indexes, and data pipelines",
    isVerified: false,
  },
  {
    name: "Education & Student Programs Lead",
    role: "Director of Technical Mentorship",
    department: "Student Development",
    focusArea: "Curriculum scaffolding, paired programming, and apprentice portfolio reviews",
    isVerified: false,
  },
];
