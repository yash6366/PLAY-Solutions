import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { StudentDevelopment } from "@/components/sections/StudentDevelopment";
import { IndustryCollaboration } from "@/components/sections/IndustryCollaboration";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { ConversionCta } from "@/components/sections/ConversionCta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ServicesOverview />
      <ProjectShowcase />
      <StudentDevelopment />
      <IndustryCollaboration />
      <HowWeWork />
      <ConversionCta />
    </>
  );
}
