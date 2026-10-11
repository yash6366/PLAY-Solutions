export interface NavItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
}

export const mainNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Industries", href: "/industries" },
  { title: "Projects", href: "/projects" },
  { title: "Internships", href: "/internships", badge: "Active" },
  { title: "Experts & Mentors", href: "/experts" },
  { title: "Contact", href: "/contact" },
];

export const footerNav = {
  solutions: [
    { title: "Software Engineering", href: "/services/custom-software" },
    { title: "Web & Mobile Development", href: "/services/web-applications" },
    { title: "AI & Machine Learning", href: "/services/ai-integrations" },
    { title: "Cloud Architecture & APIs", href: "/services/cloud-applications" },
    { title: "Quality Assurance & QA", href: "/services/software-testing" },
    { title: "Tech Consulting", href: "/services/tech-consulting" },
  ],
  ecosystem: [
    { title: "Student Internships", href: "/internships" },
    { title: "Industry Mentorship", href: "/experts" },
    { title: "Client Portfolio", href: "/projects" },
    { title: "Engineering Philosophy", href: "/about" },
    { title: "Industry Verticals", href: "/industries" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ],
};
