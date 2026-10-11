"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { HeroVisualFallback } from "./HeroVisualFallback";

function subscribeMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function checkWebGLSnapshot() {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function emptySubscribe() {
  return () => {};
}

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = React.useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    () => false
  );
  const hasWebGL = React.useSyncExternalStore(
    emptySubscribe,
    checkWebGLSnapshot,
    () => true
  );

  useEffect(() => {
    if (!hasWebGL || prefersReducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId: number;
    let isVisible = true;

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    // Group to hold all revolving elements
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Core Sphere (Wireframe & Solid core)
    const sphereGeometry = new THREE.IcosahedronGeometry(1.6, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, wireframeMaterial);
    coreGroup.add(sphereMesh);

    const innerSphereGeo = new THREE.SphereGeometry(0.9, 16, 16);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerMesh = new THREE.Mesh(innerSphereGeo, innerMaterial);
    coreGroup.add(innerMesh);

    // 2. Orbital Rings
    const ringGeometry1 = new THREE.TorusGeometry(2.4, 0.015, 12, 64);
    const ringMaterial1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.55,
    });
    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeometry2 = new THREE.TorusGeometry(2.9, 0.012, 12, 64);
    const ringMaterial2 = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.45,
    });
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    coreGroup.add(ring2);

    // 3. Constellation Nodes (120 particles)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 2, 20);
    pointLight.position.set(3, 4, 5);
    scene.add(pointLight);

    // Pointer tracking with soft bounds
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (!isVisible) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      const clampedX = Math.max(-1.5, Math.min(1.5, x));
      const clampedY = Math.max(-1.5, Math.min(1.5, y));
      targetRotationY = clampedX * 0.35;
      targetRotationX = -clampedY * 0.35;
    };
    window.addEventListener("mousemove", handlePointerMove);

    const handleTouchMove = (e: TouchEvent) => {
      if (!isVisible || !e.touches[0]) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      const clampedX = Math.max(-1.5, Math.min(1.5, x));
      const clampedY = Math.max(-1.5, Math.min(1.5, y));
      targetRotationY = clampedX * 0.35;
      targetRotationX = -clampedY * 0.35;
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // IntersectionObserver to pause rendering when not in view
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation timing using performance.now()
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth pointer interpolation
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      // Continuous subtle orbital revolutions
      sphereMesh.rotation.y = elapsed * 0.15;
      sphereMesh.rotation.x = elapsed * 0.08;
      innerMesh.rotation.y = -elapsed * 0.2;

      ring1.rotation.z = elapsed * 0.25;
      ring2.rotation.z = -elapsed * 0.18;

      particleSystem.rotation.y = elapsed * 0.04;
      particleSystem.rotation.x = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Cleanup GPU resources
      sphereGeometry.dispose();
      wireframeMaterial.dispose();
      innerSphereGeo.dispose();
      innerMaterial.dispose();
      ringGeometry1.dispose();
      ringMaterial1.dispose();
      ringGeometry2.dispose();
      ringMaterial2.dispose();
      particleGeo.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [hasWebGL, prefersReducedMotion]);

  if (hasWebGL === false || prefersReducedMotion) {
    return <HeroVisualFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      aria-label="Interactive 3D Technology Sphere"
      role="img"
    >
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 radial-glow-blue pointer-events-none -z-10" />
      <div className="absolute inset-0 radial-glow-cyan pointer-events-none -z-10" />
    </div>
  );
}
