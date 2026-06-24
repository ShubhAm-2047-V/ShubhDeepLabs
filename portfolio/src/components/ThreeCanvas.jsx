import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars, Html, Line, useTexture } from "@react-three/drei";
import * as THREE from "three";

import shubhamImg from "../assets/shubham_sunglasses.png";

// Predefined stations on our 3D journey
const STATIONS = [
  { pos: [0, 0, 5], look: [0, 0, 0] },         // Hero: Z = 5 (Camera start)
  { pos: [-1.8, 0.5, -10], look: [0, 0, -15] }, // About: Z = -10
  { pos: [2.0, -0.5, -25], look: [0, 0, -30] }, // Skills: Z = -25
  { pos: [0, 1.5, -40], look: [0, -1, -48] },    // Projects: Z = -40
  { pos: [-1.5, 0, -55], look: [0, 0, -60] },   // Timeline: Z = -55
  { pos: [0, 0, -70], look: [0, 0, -75] }       // Contact: Z = -70
];

// Custom Hook to manage camera movement along a spline/path based on scroll
function CameraController({ scrollProgressRef }) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // Determine current position on the path based on scroll progress (0 to 1)
    const progress = Math.max(0, Math.min(0.999, scrollProgressRef.current));
    
    // Map progress to the 5 segments between the 6 stations
    const segmentCount = STATIONS.length - 1;
    const rawIndex = progress * segmentCount;
    const index = Math.floor(rawIndex);
    const segmentProgress = rawIndex - index;

    const startStation = STATIONS[index];
    const endStation = STATIONS[index + 1];

    if (startStation && endStation) {
      // Interpolate camera position
      const targetPos = new THREE.Vector3().fromArray(startStation.pos).lerp(
        new THREE.Vector3().fromArray(endStation.pos),
        segmentProgress
      );
      camera.position.lerp(targetPos, 0.08);

      // Interpolate camera look-at point
      const targetLook = new THREE.Vector3().fromArray(startStation.look).lerp(
        new THREE.Vector3().fromArray(endStation.look),
        segmentProgress
      );
      currentLookAt.current.lerp(targetLook, 0.08);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

// 1. Hero Station: Holographic core (Z = 0)
function HeroStation() {
  const coreRef = useRef();
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.4;
      coreRef.current.rotation.x = t * 0.2;
    }
    if (ring1.current) ring1.current.rotation.z = t * 0.3;
    if (ring2.current) ring2.current.rotation.x = t * -0.5;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central energy core */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.6} />
      </mesh>
      
      {/* Inner pulsing core */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ff007f" />
      </mesh>

      {/* Orbiting rings */}
      <mesh ref={ring1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.4} />
      </mesh>
      
      <mesh ref={ring2} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.2, 0.03, 16, 100]} />
        <meshBasicMaterial color="#bf55ec" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// 2. About Station: Photo Frame / Holographic User (Z = -15)
function AboutStation() {
  const frameRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (frameRef.current) {
      frameRef.current.position.y = Math.sin(t * 1.5) * 0.1;
      frameRef.current.rotation.y = Math.cos(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={frameRef} position={[0, 0.5, -15]}>
      {/* 3D Glass / Hologram Frame */}
      <mesh>
        <boxGeometry args={[3.2, 4.2, 0.1]} />
        <meshStandardMaterial
          color="#bf55ec"
          transparent
          opacity={0.35}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Frame Border */}
      <mesh>
        <boxGeometry args={[3.3, 4.3, 0.05]} />
        <meshBasicMaterial color="#bf55ec" wireframe />
      </mesh>

      {/* User image in 3D frame */}
      <ImageMesh />
    </group>
  );
}

// Separate component to handle texture loading safely
function ImageMesh() {
  const texture = useTexture(shubhamImg);
  return (
    <mesh position={[0, 0, 0.06]}>
      <planeGeometry args={[3, 4]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

// 3. Skills Station: Interactive Tech Ring (Z = -30)
function SkillsStation() {
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.15;
    }
  });

  const skills = [
    { name: "React / Next.js", pos: [2.5, 0.5, 0], color: "#00f2fe" },
    { name: "Node / Express", pos: [-2.5, -0.5, 0], color: "#bf55ec" },
    { name: "Python / AI", pos: [0, 2, 2], color: "#ff007f" },
    { name: "Docker / AWS", pos: [0, -2, -2], color: "#00ffd0" },
    { name: "Figma / UI", pos: [2, -1.5, 1.5], color: "#fbbf24" },
    { name: "Automation", pos: [-2, 1.5, -1.5], color: "#34d399" }
  ];

  return (
    <group ref={ringRef} position={[0, 0, -30]}>
      {/* Main globe/core for skills */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#bf55ec"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Orbiting skill nodes */}
      {skills.map((skill, index) => (
        <group key={index} position={skill.pos}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={skill.color} />
          </mesh>
          <Html position={[0, 0.4, 0]} center style={{ pointerEvents: 'none' }}>
            <span 
              className="text-xs font-mono px-2 py-0.5 rounded border whitespace-nowrap"
              style={{
                backgroundColor: 'rgba(5, 8, 22, 0.85)',
                color: skill.color,
                borderColor: `${skill.color}66`
              }}
            >
              {skill.name}
            </span>
          </Html>
        </group>
      ))}

      {/* Connecting lines between nodes */}
      <Line
        points={skills.map(s => s.pos)}
        color="#ffffff"
        lineWidth={0.5}
        transparent
        opacity={0.2}
      />
    </group>
  );
}

// 4. Projects Station: Floating 3D Cards (Z = -45)
function ProjectsStation() {
  const cardsRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (cardsRef.current) {
      cardsRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={cardsRef} position={[0, 0, -45]}>
      {/* 3D Floating Project Elements */}
      <mesh position={[-2.5, 1, 0]}>
        <boxGeometry args={[1.5, 1, 0.2]} />
        <meshStandardMaterial color="#00f2fe" roughness={0.2} metalness={0.8} transparent opacity={0.4} />
      </mesh>
      <mesh position={[2.5, -1, 1]}>
        <boxGeometry args={[1.5, 1, 0.2]} />
        <meshStandardMaterial color="#bf55ec" roughness={0.2} metalness={0.8} transparent opacity={0.4} />
      </mesh>
      <mesh position={[-1, -2, -1]}>
        <boxGeometry args={[1.5, 1, 0.2]} />
        <meshStandardMaterial color="#ff007f" roughness={0.2} metalness={0.8} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// 5. Timeline Station: Time Tunnel / Path (Z = -60)
function TimelineStation() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 100; i++) {
      const angle = i * 0.4;
      const r = 3;
      const z = - (i * 0.2);
      pts.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, z));
    }
    return pts;
  }, []);

  return (
    <group position={[0, 0, -55]}>
      {/* Spiral timeline thread */}
      <Line points={points} color="#00f2fe" lineWidth={1.5} opacity={0.5} transparent />
    </group>
  );
}

// 6. Contact Station: Quantum Core (Z = -75)
function ContactStation() {
  const coreRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      // Heartbeat pulse effect
      const scale = 1 + Math.sin(t * 4) * 0.08;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, -75]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#ff007f"
          emissive="#ff007f"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <pointLight distance={15} intensity={5} color="#ff007f" />
    </group>
  );
}

export default function ThreeCanvas({ scrollProgressRef }) {
  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={Math.min(window.devicePixelRatio || 1, 1.5)}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <CameraController scrollProgressRef={scrollProgressRef} />
          
          {/* Universal Starfields & Particles - Optimized Count */}
          <Stars radius={100} depth={50} count={600} factor={6} saturation={0.5} fade speed={1.0} />
          <Sparkles count={50} scale={15} size={1.5} speed={0.2} color="#00f2fe" />
          <Sparkles count={40} scale={10} size={1.8} speed={0.15} color="#bf55ec" />

          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
          
          {/* Individual Stations */}
          <HeroStation />
          <AboutStation />
          <SkillsStation />
          <ProjectsStation />
          <TimelineStation />
          <ContactStation />
        </Suspense>
      </Canvas>
    </div>
  );
}
