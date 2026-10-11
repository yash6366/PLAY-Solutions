export interface InternshipOpportunity {
  id: string;
  slug: string;
  title: string;
  department: "Frontend Engineering" | "Backend Engineering" | "AI & Machine Learning" | "Mobile Engineering" | "QA & Automation";
  type: "Technical Internship" | "Project Apprenticeship" | "Research Fellowship";
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  eligibility: string;
  duration: string;
  locationMode: "Remote (Global)" | "Hybrid" | "On-Site";
  compensationStatus: "Educational / Project Stipend Evaluated per Cohort" | "Unpaid Industry Experience (Academic Credit Eligible)";
  deadline: string;
  availablePositions: number;
  published: boolean;
  termsAndExpectations: string[];
}

export const internshipOpportunities: InternshipOpportunity[] = [
  {
    id: "fullstack-internship-2026",
    slug: "fullstack-software-engineering-intern",
    title: "Full-Stack Software Engineering Intern",
    department: "Backend Engineering",
    type: "Technical Internship",
    description:
      "Work alongside senior engineering mentors to build, test, and deploy production-grade web services, API endpoints, and responsive user interfaces.",
    requiredSkills: [
      "Proficiency in modern TypeScript or JavaScript (ES6+)",
      "Foundational understanding of React or Next.js component lifecycle",
      "Familiarity with relational databases (PostgreSQL / SQL queries)",
      "Working knowledge of Git version control (branching, pull requests)",
    ],
    preferredSkills: [
      "Experience with Tailwind CSS and responsive UI design",
      "Exposure to Docker containers and automated unit testing (Vitest / Jest)",
      "Understanding of REST API design and HTTP status semantics",
    ],
    eligibility:
      "Current undergraduate/graduate students in Computer Science, Software Engineering, or related fields, or self-taught developers with demonstrated portfolio projects.",
    duration: "12 Weeks (Flexible: 15–20 hours / week)",
    locationMode: "Remote (Global)",
    compensationStatus: "Educational / Project Stipend Evaluated per Cohort",
    deadline: "Rolling Admissions for 2026/2027 Cohorts",
    availablePositions: 4,
    published: true,
    termsAndExpectations: [
      "Active participation in weekly code reviews and architectural discussions",
      "Completion of a capstone open-source or client demonstration module",
      "Honest academic integrity and adherence to team communication guidelines",
      "Official certificate of completion and written mentorship recommendations upon successful evaluation",
    ],
  },
  {
    id: "ai-ml-internship-2026",
    slug: "ai-applied-machine-learning-intern",
    title: "Applied AI & Data Systems Intern",
    department: "AI & Machine Learning",
    type: "Technical Internship",
    description:
      "Contribute to real-world Retrieval-Augmented Generation (RAG) pipelines, vector database benchmarking, and LLM evaluation frameworks under technical mentorship.",
    requiredSkills: [
      "Solid foundation in Python programming and data structures",
      "Basic understanding of vector embeddings, transformer models, and linear algebra",
      "Experience working with REST APIs and JSON data processing",
    ],
    preferredSkills: [
      "Familiarity with LangChain, LlamaIndex, or Hugging Face pipelines",
      "Experience with vector databases such as Qdrant, Chroma, or pgvector",
      "Understanding of prompt evaluation metrics and automated testing",
    ],
    eligibility:
      "Upper-level undergraduate or graduate students with coursework in Artificial Intelligence, Machine Learning, or Computational Mathematics.",
    duration: "12 Weeks (15–20 hours / week)",
    locationMode: "Remote (Global)",
    compensationStatus: "Educational / Project Stipend Evaluated per Cohort",
    deadline: "Open Application",
    availablePositions: 2,
    published: true,
    termsAndExpectations: [
      "Weekly progress demos during engineering sync meetings",
      "Adherence to strict data privacy and responsible AI development principles",
      "Production of reproducible benchmarks and technical documentation",
    ],
  },
  {
    id: "mobile-dev-internship-2026",
    slug: "cross-platform-mobile-dev-intern",
    title: "Cross-Platform Mobile Engineering Intern",
    department: "Mobile Engineering",
    type: "Technical Internship",
    description:
      "Learn and apply mobile software architecture principles to build cross-platform applications with React Native, focusing on smooth performance and offline capabilities.",
    requiredSkills: [
      "Understanding of React principles (state, props, hooks)",
      "Basic experience with TypeScript",
      "Eagerness to learn mobile build systems (Expo, Android Studio, Xcode)",
    ],
    preferredSkills: [
      "Prior experience with React Native or Flutter personal projects",
      "Familiarity with mobile UI accessibility patterns",
    ],
    eligibility:
      "Enrolled students or recent graduates seeking hands-on mobile application development experience.",
    duration: "10 Weeks (15 hours / week)",
    locationMode: "Remote (Global)",
    compensationStatus: "Unpaid Industry Experience (Academic Credit Eligible)",
    deadline: "Open Application",
    availablePositions: 3,
    published: true,
    termsAndExpectations: [
      "Weekly paired programming sessions with assigned engineering mentors",
      "Portfolio project deployment to test distribution channels (TestFlight/Internal Track)",
    ],
  },
  {
    id: "qa-automation-internship-2026",
    slug: "qa-test-automation-intern",
    title: "Software QA & Test Automation Intern",
    department: "QA & Automation",
    type: "Technical Internship",
    description:
      "Develop end-to-end testing skills using Playwright and Vitest to safeguard application reliability across browsers and devices.",
    requiredSkills: [
      "Basic JavaScript/TypeScript knowledge",
      "Methodical attention to detail and ability to write structured test cases",
    ],
    preferredSkills: [
      "Exposure to automated test runners or browser developer tools",
      "Understanding of CI/CD concepts (GitHub Actions)",
    ],
    eligibility:
      "Students looking to specialize in modern Software Quality Assurance, SDET roles, or test automation.",
    duration: "8 Weeks (12–15 hours / week)",
    locationMode: "Remote (Global)",
    compensationStatus: "Unpaid Industry Experience (Academic Credit Eligible)",
    deadline: "Open Application",
    availablePositions: 2,
    published: true,
    termsAndExpectations: [
      "Authoring automated test specs covering core user journeys",
      "Writing defect reproduction logs and assisting with pull request verification",
    ],
  },
];
