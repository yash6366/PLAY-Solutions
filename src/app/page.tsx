import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { BusinessChallenges } from "@/components/sections/BusinessChallenges";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { CompanyPrinciples } from "@/components/sections/CompanyPrinciples";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { IndustriesPreview } from "@/components/sections/IndustriesPreview";
import { TechnicalInsights } from "@/components/sections/TechnicalInsights";
import { CareersLearningSection } from "@/components/sections/CareersLearningSection";
import { HomepageFaq } from "@/components/sections/HomepageFaq";
import { ConversionCta } from "@/components/sections/ConversionCta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <BusinessChallenges />
      <ServicesOverview />
      <ProjectShowcase />
      <CompanyPrinciples />
      <HowWeWork />
      <IndustriesPreview />
      <TechnicalInsights />
      <CareersLearningSection />
      <HomepageFaq />
      <ConversionCta />
    </>
  );
}
