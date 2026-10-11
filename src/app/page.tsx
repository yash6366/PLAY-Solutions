import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { CompanyPrinciples } from "@/components/sections/CompanyPrinciples";
import { CareersLearningSection } from "@/components/sections/CareersLearningSection";
import { HomepageFaq } from "@/components/sections/HomepageFaq";
import { ConversionCta } from "@/components/sections/ConversionCta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ServicesOverview />
      <ProjectShowcase />
      <HowWeWork />
      <CompanyPrinciples />
      <CareersLearningSection />
      <HomepageFaq />
      <ConversionCta />
    </>
  );
}
