"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function CameraParallax({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  useFrame(() => {
    const parallaxX = (mouseX - 0.5) * 0.6;
    const parallaxY = (mouseY - 0.5) * 0.4;
    target.current.set(parallaxX, -parallaxY, 0);
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function CentralSphere() {
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#BD8665"),
    emissive: new THREE.Color("#E7C1AB"),
    emissiveIntensity: 0.2,
    roughness: 0.6,
    metalness: 0.1,
    transparent: true,
    opacity: 0.95,
  }), []);
  return (
    <mesh>
      <sphereGeometry args={[0.6, 48, 48]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function WireHalo() {
  const geo = useMemo(() => new THREE.RingGeometry(0.95, 1.0, 64), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#4A5568", wireframe: false, side: THREE.DoubleSide, transparent: true, opacity: 0.35 }), []);
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <primitive object={geo} attach="geometry" />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function OrbitPath({ radius, segments = 128 }: { radius: number; segments?: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius, segments]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <lineLoop>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#4A5568" transparent opacity={0.3} />
    </lineLoop>
  );
}

function OrbitingSphere({ radius, speed, size, phase, wire = false }: { radius: number; speed: number; size: number; phase: number; wire?: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const angleRef = useRef(phase);
  const material = useMemo(() => wire
    ? new THREE.MeshBasicMaterial({ color: "#2D3748", wireframe: true, transparent: true, opacity: 0.6 })
    : new THREE.MeshStandardMaterial({ color: "#2D3748", emissive: new THREE.Color("#4A5568"), emissiveIntensity: 0.1, roughness: 0.8, metalness: 0.1 }), []);

  const scrollDir = useRef(1);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollDir.current = y > lastY ? 1 : -1;
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((_, delta) => {
    angleRef.current += delta * speed * scrollDir.current;
    const x = Math.cos(angleRef.current) * radius;
    const z = Math.sin(angleRef.current) * radius;
    if (ref.current) {
      ref.current.position.set(x, 0, z);
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, wire ? 8 : 24, wire ? 8 : 24]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  // Lights (subtle)
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[2, 3, 4]} intensity={0.4} />
      <directionalLight position={[-3, -2, 1]} intensity={0.25} />

      <group rotation={[THREE.MathUtils.degToRad(45), 0, 0]}>
        <CentralSphere />
        <WireHalo />
        {/* Orbit paths */}
        {[
          1.4, 1.8, 2.2, 2.6, 3.0, 3.4,
        ].map((r, i) => (
          <OrbitPath key={`path-${i}`} radius={r} />
        ))}
        {/* Orbiting agents: mix of wireframe + solid for a sketch-like aesthetic */}
        {[
          { r: 1.4, s: 0.6, size: 0.12, phase: 0.0, wire: true },
          { r: 1.8, s: 0.45, size: 0.14, phase: 1.0, wire: false },
          { r: 2.2, s: 0.35, size: 0.12, phase: 2.1, wire: true },
          { r: 2.6, s: 0.28, size: 0.15, phase: 3.2, wire: false },
          { r: 3.0, s: 0.22, size: 0.11, phase: 0.7, wire: true },
          { r: 3.4, s: 0.18, size: 0.13, phase: 1.7, wire: false },
        ].map((o, i) => (
          <OrbitingSphere key={i} radius={o.r} speed={o.s} size={o.size} phase={o.phase} wire={o.wire} />
        ))}
      </group>

      <CameraParallax mouseX={mouseX} mouseY={mouseY} />
    </>
  );
}

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax transforms for text
  const springOptions = { stiffness: 120, damping: 20, mass: 0.6 } as const;
  const x = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), springOptions);
  const y = useSpring(useTransform(mouseY, [0, 1], [-6, 6]), springOptions);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth);
      mouseY.set(e.clientY / innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // (Removed) Background parallax was tied to the in-hero canvas; orbits are now global.
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <section data-hero className="relative min-h-[100svh] flex items-center bg-transparent">
      {/* Readability gradient overlay (left emphasis) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-offwhite/60 via-offwhite/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            style={{ x, y }}
            className="font-serif text-4xl md:text-6xl tracking-tight max-w-4xl"
          >
            Redefine Product Development with Ensemble.
          </motion.h1>
          <motion.p
            style={{ x, y }}
            className="mt-6 text-slate-700 text-lg md:text-xl max-w-2xl"
          >
            AI agents that behave like real people. Instant, reliable, continuous product feedback for developers and engineers.
          </motion.p>
          <div className="mt-8">
            <motion.a
              href="#waitlist"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center rounded-full px-7 py-3 glass border-2 border-tan-500 ring-1 ring-slate-800/15 ring-offset-2 ring-offset-offwhite text-slate-800"
              style={{ x, y }}
            >
              Join Waitlist
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


