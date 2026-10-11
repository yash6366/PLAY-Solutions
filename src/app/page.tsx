import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { WhyPlayqSection } from "@/components/sections/WhyPlayqSection";
import { IndustriesPreview } from "@/components/sections/IndustriesPreview";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { ConversionCta } from "@/components/sections/ConversionCta";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero and Brand Identity (with 3D Three.js sphere animation) */}
      <HeroSection />

      {/* 2. Core Services */}
      <ServicesOverview />

      {/* 3. Selected Projects */}
      <ProjectShowcase />

      {/* 4. Why PLAYQ Solutions (Consolidated Trust & Differentiation) */}
      <WhyPlayqSection />

      {/* 5. Industries (Compact Overview) */}
      <IndustriesPreview />

      {/* 6. How We Work (4 Delivery Stages) */}
      <HowWeWork />

      {/* 7. Final Contact CTA */}
      <ConversionCta />
    </>
  );
}
