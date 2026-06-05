"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, Scroll, Float, ContactShadows, Edges, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function SketchParticles({ count = 250 }) {
  const mesh = useRef();
  const dummy = new THREE.Object3D();

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  const positions = Array.from({ length: count }, () => [
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40,
  ]);

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <boxGeometry args={[0.08, 0.08, 0.08]} />
      <meshBasicMaterial color="#2C2C2C" />
      {positions.map((pos, i) => {
        dummy.position.set(...pos);
        dummy.updateMatrix();
        return <primitive key={i} object={dummy} instanceMatrix={dummy.matrix} />;
      })}
    </instancedMesh>
  );
}

// 3D Box with Hand-Sketched edges
function SketchedBox({ position, rotation, scale, color, offset }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + offset;
    ref.current.rotation.x = Math.sin(t / 4) / 4 + rotation[0];
    ref.current.rotation.y = Math.cos(t / 4) / 4 + rotation[1];
    ref.current.rotation.z = Math.sin(t / 4) / 4 + rotation[2];
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.8} />
        <Edges scale={1} threshold={15} color="#2C2C2C" />
      </mesh>
    </Float>
  );
}

// A 3D model of a Notebook/Notepad
function SketchNotebook({ position, rotation, scale, color }) {
  const group = useRef();
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group} position={position} rotation={rotation} scale={scale}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[4, 5, 0.4]} />
          <meshStandardMaterial color={color} roughness={0.9} />
          <Edges scale={1} threshold={15} color="#2C2C2C" />
        </mesh>
        
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[-1.8, 2 - i * 0.55, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.05, 8, 24]} />
            <meshStandardMaterial color="#2C2C2C" roughness={0.5} metalness={0.8} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Moves elements based on scroll in the 3D space
function SceneElements() {
  const groupRef = useRef();

  useFrame((state) => {
    // In ScrollControls, state.camera or scroll offset can be accessed, but let's just make the objects float beautifully globally
  });

  return (
    <group ref={groupRef}>
      <PresentationControls global rotation={[0, 0, 0]} polar={[-0.2, 0.2]} azimuth={[-0.2, 0.2]} config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
        {/* Floating background elements spread vertically so they appear as you scroll */}
        
        {/* Hero Section depth items */}
        <SketchNotebook position={[5, 1, -3]} rotation={[-0.2, -0.4, 0.1]} scale={1.2} color="#FFF59D" />
        <SketchedBox position={[-4, 2, -2]} rotation={[0, 0, 0]} scale={1} color="#90CAF9" offset={0} />

        {/* Section 2 depth items */}
        <SketchNotebook position={[-6, -6, -4]} rotation={[0.2, 0.5, -0.1]} scale={1.5} color="#A5D6A7" />
        <SketchedBox position={[5, -5, -2]} rotation={[0.5, 0.5, 0]} scale={1.5} color="#FFCA28" offset={2} />

        {/* Section 3 depth items */}
        <SketchNotebook position={[4, -14, -5]} rotation={[-0.1, -0.2, 0.2]} scale={1} color="#EF9A9A" />
        <SketchedBox position={[-5, -16, -1]} rotation={[1, 0, 0.5]} scale={2} color="#CE93D8" offset={4} />

      </PresentationControls>
    </group>
  );
}

export default function ThreeWorld({ children }) {
  return (
    <div className="w-full h-screen fixed inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={["#FAF6EE"]} />
        <fog attach="fog" args={["#FAF6EE", 8, 30]} />
        
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-10, 10, -10]} intensity={0.3} color="#FFF59D" />

        <ScrollControls pages={6} damping={0.1}>
          
          <Scroll>
            {/* 3D Content that scrolls with the page */}
            <SceneElements />
          </Scroll>

          <Scroll html style={{ width: '100%' }}>
            {/* 2D HTML Content (The original website) */}
            {children}
          </Scroll>

        </ScrollControls>

        <SketchParticles count={200} />
        <ContactShadows position={[0, -20, 0]} opacity={0.3} scale={40} blur={2} far={10} color="#2C2C2C" />
      </Canvas>
    </div>
  );
}
