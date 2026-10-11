import type { Metadata } from "next";
import "./globals.css";
import { brandConfig } from "@/config/brand";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PrelaunchBanner } from "@/components/layout/PrelaunchBanner";

export const metadata: Metadata = {
  metadataBase: new URL(brandConfig.websiteUrl || "https://playqsolutions.com"),
  title: {
    default: `${brandConfig.companyName} | ${brandConfig.tagline}`,
    template: `%s | ${brandConfig.shortName}`,
  },
  description: brandConfig.description,
  keywords: [
    "Software Engineering",
    "Web Application Development",
    "Mobile Applications",
    "Artificial Intelligence",
    "Machine Learning Integration",
    "Technical Mentorship",
    "Student Internships",
    "Technology Consulting",
  ],
  authors: [{ name: brandConfig.companyName }],
  creator: brandConfig.companyName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: brandConfig.websiteUrl,
    title: `${brandConfig.companyName} | ${brandConfig.tagline}`,
    description: brandConfig.description,
    siteName: brandConfig.companyName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandConfig.companyName} | ${brandConfig.tagline}`,
    description: brandConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandConfig.companyName,
    alternateName: brandConfig.shortName,
    url: brandConfig.websiteUrl,
    description: brandConfig.description,
    email: brandConfig.primaryEmail,
    telephone: brandConfig.contactPhone,
    address: {
      "@type": "PostalAddress",
      addressLocality: brandConfig.location,
    },
    sameAs: [
      brandConfig.socialLinks.linkedin,
      brandConfig.socialLinks.github,
    ].filter(Boolean),
  };

  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-[#080B14] text-slate-100 antialiased selection:bg-blue-600 selection:text-white flex flex-col min-h-screen">
        {/* Accessibility Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg font-medium outline-none ring-2 ring-cyan-400"
        >
          Skip to main content
        </a>

        <PrelaunchBanner />
        <Navbar />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
