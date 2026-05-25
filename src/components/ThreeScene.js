"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Ensure we start with a clean container – remove any previous canvas
    if (containerRef.current) {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    }

    if (!containerRef.current) return;

    // 1. SETUP THREE SCENE & CAMERA
    const scene = new THREE.Scene();
    
    // Set fog matching the warm paper cream background
    scene.fog = new THREE.FogExp2(0xfaf6ee, 0.012);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 24;
    camera.position.y = 1.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. CREATING A HIGHLY ATTRACTIVE NESTED SKETCHING DRAFTING MODEL
    const draftGroup = new THREE.Group();
    scene.add(draftGroup);

    // Charcoal pencil style materials
    const darkLineMaterial = new THREE.LineBasicMaterial({
      color: 0x2c2c2c,
      transparent: true,
      opacity: 0.35,
    });

    const lightLineMaterial = new THREE.LineBasicMaterial({
      color: 0x5a5a5a,
      transparent: true,
      opacity: 0.15,
    });

    // Sub-element A: Outer Drafting Sphere Ring (Planetary look)
    const ringGeometry = new THREE.RingGeometry(5.2, 5.3, 30);
    const ringWire = new THREE.WireframeGeometry(ringGeometry);
    const outerRing = new THREE.LineSegments(ringWire, darkLineMaterial);
    outerRing.rotation.x = Math.PI / 2.5;
    draftGroup.add(outerRing);

    // Sub-element B: Outer Sketchy Cube
    const outerBoxGeo = new THREE.BoxGeometry(6, 6, 6, 2, 2, 2);
    const outerBoxWire = new THREE.WireframeGeometry(outerBoxGeo);
    const outerCube = new THREE.LineSegments(outerBoxWire, darkLineMaterial);
    draftGroup.add(outerCube);

    // Sub-element C: Inner Sketchy Cube (Rotates in opposite direction for visual wow!)
    const innerBoxGeo = new THREE.BoxGeometry(3.5, 3.5, 3.5, 1, 1, 1);
    const innerBoxWire = new THREE.WireframeGeometry(innerBoxGeo);
    const innerCube = new THREE.LineSegments(innerBoxWire, lightLineMaterial);
    draftGroup.add(innerCube);

    // Imperfect Pencil Nodes (Graphite dots at outer box vertices)
    const pointsGeometry = new THREE.BufferGeometry();
    const vertices = [];
    const posAttribute = outerBoxGeo.getAttribute("position");
    for (let i = 0; i < posAttribute.count; i++) {
      vertices.push(posAttribute.getX(i), posAttribute.getY(i), posAttribute.getZ(i));
    }
    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    // Graphite node texture
    const createPencilDotTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      
      // Pencil graphite point
      ctx.fillStyle = "rgba(44, 44, 44, 0.9)";
      ctx.beginPath();
      ctx.arc(8, 8, 4.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Rough sketching rings
      ctx.strokeStyle = "rgba(44, 44, 44, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(8, 8, 6.5, 0, Math.PI * 2);
      ctx.stroke();

      return new THREE.CanvasTexture(canvas);
    };

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.65,
      map: createPencilDotTexture(),
      transparent: true,
      depthWrite: false,
    });
    
    const cubeNodes = new THREE.Points(pointsGeometry, pointsMaterial);
    draftGroup.add(cubeNodes);

    // Position the drafting group on the right matching the homepage structure
    draftGroup.position.x = 6.2;
    draftGroup.position.y = 0.5;

    // 3. CREATING FLOATING GRAPHITE PARTICLES WITH COLORED SPARKS (Star dust)
    const starsCount = 450;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    const feltColors = [
      new THREE.Color(0x81c784), // green spark
      new THREE.Color(0x64b5f6), // blue spark
      new THREE.Color(0xffb74d), // orange spark
      new THREE.Color(0xce93d8), // purple spark
      new THREE.Color(0xff8a80), // red spark
    ];

    for (let i = 0; i < starsCount * 3; i += 3) {
      const radius = 10 + Math.random() * 20;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);

      // 75% charcoal, 25% colorful felt spark nodes (Highly attractive but subtle)
      if (Math.random() > 0.75) {
        const col = feltColors[Math.floor(Math.random() * feltColors.length)];
        starColors[i] = col.r;
        starColors[i + 1] = col.g;
        starColors[i + 2] = col.b;
      } else {
        // Graphite charcoal grey
        starColors[i] = 0.25;
        starColors[i + 1] = 0.25;
        starColors[i + 2] = 0.25;
      }
    }
    
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    
    starsGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(starColors, 3)
    );

    const createSpeckTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 8;
      canvas.height = 8;
      const ctx = canvas.getContext("2d");
      // Use clean white circles so that vertexColors multiply and color correctly!
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    };

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.5,
      map: createSpeckTexture(),
      transparent: true,
      opacity: 0.7,
      vertexColors: true, // Enables dynamic point colors!
    });
    
    const starSystem = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starSystem);

    // 4. SOFT WARM LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const directional = new THREE.DirectionalLight(0xfff5e6, 0.4);
    directional.position.set(10, 15, 10);
    scene.add(directional);

    // 5. INTERACTIVITY & EASING
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 120;
      mouseY = (e.clientY - window.innerHeight / 2) / 120;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 6. SCROLL DYNAMICS SETUP (Parallax)
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    // 7. ANIMATION FRAME RENDER LOOP (60 FPS)
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse easing (Lerp)
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Outer Box Rotates
      outerCube.rotation.x = elapsedTime * 0.09;
      outerCube.rotation.y = elapsedTime * 0.12;

      // Inner Box Rotates opposite direction (Attractive!)
      innerCube.rotation.x = -elapsedTime * 0.15;
      innerCube.rotation.y = -elapsedTime * 0.08;

      // Outer Ring Rotates
      outerRing.rotation.z = elapsedTime * 0.05;
      outerRing.rotation.y = elapsedTime * 0.02;

      // Dots match outer cube rotation
      cubeNodes.rotation.x = outerCube.rotation.x;
      cubeNodes.rotation.y = outerCube.rotation.y;

      // Floating dynamic lift
      draftGroup.position.y = 0.5 + Math.sin(elapsedTime * 1.3) * 0.45;

      // Particles orbit
      starSystem.rotation.y = elapsedTime * 0.015 + targetX * 0.06;
      starSystem.rotation.x = targetY * 0.05;

      // Parallax Camera movement
      camera.position.y = 1.5 - targetY * 0.8 - scrollY * 0.008;
      camera.position.x = targetX * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    // 8. SCREEN VIEWPORT RESIZING
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // 9. CLEANUP MEMORY ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose assets
      ringGeometry.dispose();
      ringWire.dispose();
      outerBoxGeo.dispose();
      outerBoxWire.dispose();
      innerBoxGeo.dispose();
      innerBoxWire.dispose();
      pointsGeometry.dispose();
      starsGeometry.dispose();
      darkLineMaterial.dispose();
      lightLineMaterial.dispose();
      pointsMaterial.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ minHeight: "100vh" }}
    />
  );
}
