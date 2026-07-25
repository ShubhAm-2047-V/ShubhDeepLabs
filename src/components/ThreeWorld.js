"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Edges, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

// Helper hook to get scroll progress without triggering React re-renders
function useScrollProgress() {
  const progress = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progress.current = scrollY / height;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return progress;
}

function SketchParticles({ count = 250, color = "#2C2C2C" }) {
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
      <meshBasicMaterial color={color} />
      {positions.map((pos, i) => {
        dummy.position.set(...pos);
        dummy.updateMatrix();
        return <primitive key={i} object={dummy} instanceMatrix={dummy.matrix} />;
      })}
    </instancedMesh>
  );
}

// 3D Box with Hand-Sketched / Tech edges
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
        <meshStandardMaterial color={color} roughness={0.6} />
        <Edges scale={1} threshold={15} color="#0D3B47" />
      </mesh>
    </Float>
  );
}

// A 3D model of a Notebook/Notepad (for Student Desk)
function SketchNotebook({ position, rotation, scale, color, scrollRef, scrollMultiplier, scrollOffset }) {
  const group = useRef();
  const coverGroup = useRef();
  const smoothProgress = useRef(0);

  useFrame((state, delta) => {
    if (!scrollRef) return;
    
    smoothProgress.current = THREE.MathUtils.lerp(smoothProgress.current, scrollRef.current, delta * 4);
    const p = smoothProgress.current;

    if (coverGroup.current) {
      const openProgress = Math.abs(Math.sin(p * Math.PI * scrollMultiplier + scrollOffset));
      coverGroup.current.rotation.y = -openProgress * Math.PI * 0.8;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group} position={position} rotation={rotation} scale={scale}>
        <mesh castShadow receiveShadow position={[0, 0, -0.15]}>
          <boxGeometry args={[4, 5, 0.3]} />
          <meshStandardMaterial color="#FFFBF5" roughness={0.9} />
          <Edges scale={1} threshold={15} color="#2C2C2C" />
        </mesh>

        <group ref={coverGroup} position={[-2, 0, 0.05]}>
          <mesh castShadow receiveShadow position={[2, 0, 0]}>
            <boxGeometry args={[4, 5, 0.1]} />
            <meshStandardMaterial color={color} roughness={0.9} />
            <Edges scale={1} threshold={15} color="#2C2C2C" />
          </mesh>
        </group>
        
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[-1.8, 2 - i * 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.05, 8, 24]} />
            <meshStandardMaterial color="#2C2C2C" roughness={0.5} metalness={0.8} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function SceneElements({ hideBooks = false }) {
  const scrollRef = useScrollProgress();
  const smoothProgress = useRef(0);
  
  const groupRef1 = useRef();
  const groupRef2 = useRef();

  useFrame((state, delta) => {
    smoothProgress.current = THREE.MathUtils.lerp(smoothProgress.current, scrollRef.current, delta * 3);
    const p = smoothProgress.current;

    if (groupRef1.current) {
      groupRef1.current.position.y = Math.sin(p * Math.PI * 2) * 3;
      groupRef1.current.position.x = Math.cos(p * Math.PI * 2) * 5;
      groupRef1.current.rotation.y = p * Math.PI * 4;
      groupRef1.current.rotation.x = Math.sin(p * Math.PI) * 0.5;
    }
    if (groupRef2.current) {
      groupRef2.current.position.y = Math.cos(p * Math.PI * 4) * 4;
      groupRef2.current.position.x = Math.sin(p * Math.PI * 2) * -6;
      groupRef2.current.rotation.x = p * Math.PI * 2;
      groupRef2.current.rotation.y = p * Math.PI;
    }
  });

  if (hideBooks) {
    return (
      <PresentationControls global rotation={[0.1, -0.2, 0]} polar={[-0.4, 0.2]} azimuth={[-0.4, 0.2]} config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
        {/* Floating tech cubes for Business mode instead of notebooks */}
        <group ref={groupRef1}>
          <SketchedBox position={[0, 0, -2]} rotation={[0.2, 0.1, 0]} scale={[1.2, 1.2, 1.2]} color="#66C2D1" offset={0} />
        </group>
        <group ref={groupRef2}>
          <SketchedBox position={[0, 0, -4]} rotation={[-0.2, 0.5, 0.1]} scale={[1, 1, 1]} color="#BFE8F7" offset={2} />
        </group>
      </PresentationControls>
    );
  }

  return (
    <PresentationControls global rotation={[0.1, -0.2, 0]} polar={[-0.4, 0.2]} azimuth={[-0.4, 0.2]} config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
      <group ref={groupRef1}>
        <SketchNotebook scrollRef={scrollRef} scrollMultiplier={6} scrollOffset={0} position={[0, 0, -2]} rotation={[0.2, 0.1, 0]} scale={0.7} color="#FFF59D" />
      </group>
      
      <group ref={groupRef2}>
        <SketchNotebook scrollRef={scrollRef} scrollMultiplier={8} scrollOffset={Math.PI / 2} position={[0, 0, -4]} rotation={[-0.2, 0.5, 0.1]} scale={0.6} color="#A5D6A7" />
      </group>
    </PresentationControls>
  );
}

export default function ThreeWorld({ hideBooks = false }) {
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    setEventSource(document.body);
  }, []);

  return (
    <div className="w-full h-screen fixed inset-0 z-0 pointer-events-none">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }} eventSource={eventSource || undefined} eventPrefix="client">
        <fog attach="fog" args={[hideBooks ? "#F0FBFF" : "#FAF6EE", 8, 30]} />
        
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-10, 10, -10]} intensity={0.3} color={hideBooks ? "#66C2D1" : "#FFF59D"} />

        <SceneElements hideBooks={hideBooks} />
        <SketchParticles count={250} color={hideBooks ? "#66C2D1" : "#2C2C2C"} />

        <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={40} blur={2} far={10} color={hideBooks ? "#0D3B47" : "#2C2C2C"} />
      </Canvas>
    </div>
  );
}
