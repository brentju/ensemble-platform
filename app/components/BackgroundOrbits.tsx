"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  const mat = useMemo(
  () =>
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('lightblue'),     // keep it neutral; color comes from refraction
      transmission: 1.0,                     // full glass-like transmission
      thickness: 4.5,                        // deeper internal refraction for an orb
      ior: 1.45,                             // typical glass/crystal IOR
      roughness: 0.02,                       // very smooth surface
      metalness: 0.0,
      clearcoat: 1,                        // glossy outer layer
      clearcoatRoughness: 0.03,
      reflectivity: 1,                     // boosts reflection sharpness
      attenuationColor: new THREE.Color('lightblue'), // subtle blue tint for crystal feel
      attenuationDistance: 2.75,             // controls how far light travels inside
      envMapIntensity: 2.0,                  // stronger environment reflection
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,                // avoid dark backfaces in refraction
    }),
  []
);

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
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[2, 3, 4]} intensity={0.4} />
      <directionalLight position={[-3, -2, 1]} intensity={0.25} />

      <group rotation={[THREE.MathUtils.degToRad(45), 0, 0]}>
        <CentralSphere />
        <WireHalo />
        {[1.4, 1.8, 2.2, 2.6, 3.0, 3.4].map((r, i) => (
          <OrbitPath key={`path-${i}`} radius={r} />
        ))}
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

export default function BackgroundOrbits() {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas dpr={[1, 1.5]} gl={{ alpha: true }} camera={{ position: [0, 0, 6], fov: 50 }}>
        {/* Transparent canvas; background gradient shows through */}
        <Scene mouseX={mouse.current.x} mouseY={mouse.current.y} />
      </Canvas>
    </div>
  );
}


