
"use client";

import React from "react";

export function HeroVisualFallback() {
  return (
    <div
      className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px] flex items-center justify-center overflow-hidden rounded-2xl select-none"
      aria-label="Abstract digital software engineering wireframe visualization"
      role="img"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 radial-glow-blue pointer-events-none -z-10" />
      <div className="absolute inset-0 radial-glow-cyan pointer-events-none -z-10" />

      {/* Static 3D Wireframe Representation */}
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] opacity-90 transition-opacity"
        aria-hidden="true"
      >
        {/* Outer Orbital Ring 1 */}
        <ellipse
          cx="200"
          cy="200"
          rx="170"
          ry="65"
          transform="rotate(-25 200 200)"
          stroke="#06B6D4"
          strokeWidth="1.25"
          strokeDasharray="4 4"
          strokeOpacity="0.45"
        />

        {/* Outer Orbital Ring 2 */}
        <ellipse
          cx="200"
          cy="200"
          rx="155"
          ry="55"
          transform="rotate(35 200 200)"
          stroke="#3B82F6"
          strokeWidth="1.25"
          strokeOpacity="0.5"
        />

        {/* Core Wireframe Latitude Ellipses */}
        <ellipse
          cx="200"
          cy="200"
          rx="110"
          ry="110"
          stroke="#3B82F6"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="110"
          ry="55"
          stroke="#3B82F6"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="110"
          ry="20"
          stroke="#38BDF8"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Core Wireframe Longitude Ellipses */}
        <ellipse
          cx="200"
          cy="200"
          rx="55"
          ry="110"
          stroke="#3B82F6"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="20"
          ry="110"
          stroke="#38BDF8"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Diagonal Geodesic Facet Lines */}
        <line x1="122" y1="122" x2="278" y2="278" stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.25" />
        <line x1="278" y1="122" x2="122" y2="278" stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.25" />
        <line x1="200" y1="90" x2="278" y2="200" stroke="#06B6D4" strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="278" y1="200" x2="200" y2="310" stroke="#06B6D4" strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="200" y1="310" x2="122" y2="200" stroke="#06B6D4" strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="122" y1="200" x2="200" y2="90" stroke="#06B6D4" strokeWidth="0.8" strokeOpacity="0.3" />

        {/* Inner Core */}
        <circle
          cx="200"
          cy="200"
          r="45"
          fill="url(#coreGradient)"
          fillOpacity="0.12"
          stroke="#6366F1"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />

        {/* Constellation Particle Nodes */}
        <circle cx="200" cy="90" r="3" fill="#38BDF8" fillOpacity="0.85" />
        <circle cx="200" cy="310" r="3" fill="#38BDF8" fillOpacity="0.85" />
        <circle cx="90" cy="200" r="3" fill="#38BDF8" fillOpacity="0.85" />
        <circle cx="310" cy="200" r="3" fill="#38BDF8" fillOpacity="0.85" />
        <circle cx="122" cy="122" r="2.5" fill="#06B6D4" fillOpacity="0.9" />
        <circle cx="278" cy="122" r="2.5" fill="#06B6D4" fillOpacity="0.9" />
        <circle cx="122" cy="278" r="2.5" fill="#06B6D4" fillOpacity="0.9" />
        <circle cx="278" cy="278" r="2.5" fill="#06B6D4" fillOpacity="0.9" />
        <circle cx="65" cy="140" r="2" fill="#3B82F6" fillOpacity="0.7" />
        <circle cx="335" cy="260" r="2" fill="#3B82F6" fillOpacity="0.7" />
        <circle cx="255" cy="70" r="2" fill="#3B82F6" fillOpacity="0.7" />
        <circle cx="145" cy="330" r="2" fill="#3B82F6" fillOpacity="0.7" />

        {/* Center Node */}
        <circle cx="200" cy="200" r="4" fill="#38BDF8" fillOpacity="0.9" />
        <circle cx="200" cy="200" r="8" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />

        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
