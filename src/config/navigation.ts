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
  { title: "Careers", href: "/internships" },
  { title: "Contact", href: "/contact" },
];

export const footerNav = {
  solutions: [
    { title: "Custom Software", href: "/services/custom-software" },
    { title: "Web & Mobile Development", href: "/services/web-applications" },
    { title: "AI & Intelligent Automation", href: "/services/ai-integrations" },
    { title: "Cloud Architecture & APIs", href: "/services/cloud-applications" },
    { title: "Quality Assurance & QA", href: "/services/software-testing" },
    { title: "Technology Consulting", href: "/services/tech-consulting" },
  ],
  ecosystem: [
    { title: "About PLAYTS", href: "/about" },
    { title: "Services Catalog", href: "/services" },
    { title: "Industry Verticals", href: "/industries" },
    { title: "Selected Projects", href: "/projects" },
    { title: "Careers", href: "/internships" },
    { title: "Contact Engineering", href: "/contact" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ],
};
