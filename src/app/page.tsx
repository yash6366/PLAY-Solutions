import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { StudentDevelopment } from "@/components/sections/StudentDevelopment";
import { IndustryCollaboration } from "@/components/sections/IndustryCollaboration";
import { HomepageFaq } from "@/components/sections/HomepageFaq";
import { ConversionCta } from "@/components/sections/ConversionCta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProjectShowcase />
      <ServicesOverview />
      <TrustStrip />
      <HowWeWork />
      <StudentDevelopment />
      <IndustryCollaboration />
      <HomepageFaq />
      <ConversionCta />
    </>
  );
}
