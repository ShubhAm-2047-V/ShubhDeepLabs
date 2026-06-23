import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas({ scrollProgressRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // Disable WebGL on mobile for performance

    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    
    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 10;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Group to hold all wireframe objects
    const group = new THREE.Group();
    scene.add(group);

    // Array of created objects for disposal
    const geometries = [];
    const materials = [];
    const cubes = [];

    // Helper to create clean wireframe box using EdgesGeometry
    const createWireframeBox = (width, height, depth, color, opacity = 0.35) => {
      const boxGeom = new THREE.BoxGeometry(width, height, depth);
      geometries.push(boxGeom);

      const edgesGeom = new THREE.EdgesGeometry(boxGeom);
      geometries.push(edgesGeom);

      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: opacity,
        linewidth: 1
      });
      materials.push(lineMat);

      const lineSegments = new THREE.LineSegments(edgesGeom, lineMat);
      return lineSegments;
    };

    // 5. Create multiple cubes of varying sizes and locations
    const cubeSettings = [
      // Large background cubes
      { size: [3.5, 3.5, 3.5], pos: [-6, 3, -10], color: "#FF3333", opacity: 0.15, rotSpeed: [0.03, 0.05] },
      { size: [4.0, 4.0, 4.0], pos: [7, -4, -12], color: "#FFFFFF", opacity: 0.12, rotSpeed: [0.04, 0.02] },
      
      // Medium midground cubes
      { size: [2.2, 2.2, 2.2], pos: [-4, -2.5, -4], color: "#FFFFFF", opacity: 0.25, rotSpeed: [0.08, 0.06] },
      { size: [2.5, 2.5, 2.5], pos: [5, 2.5, -5], color: "#FF3333", opacity: 0.28, rotSpeed: [0.05, 0.09] },
      
      // Hero foreground cubes (closer to camera)
      { size: [1.3, 1.3, 1.3], pos: [-1.5, 1.8, 1], color: "#FF3333", opacity: 0.45, rotSpeed: [0.12, 0.15] },
      { size: [1.1, 1.1, 1.1], pos: [2.2, -1.2, 2], color: "#FFFFFF", opacity: 0.40, rotSpeed: [0.15, 0.10] },
      { size: [0.8, 0.8, 0.8], pos: [3.0, 1.5, 0], color: "#FF5E5E", opacity: 0.35, rotSpeed: [0.09, 0.18] },
      { size: [0.7, 0.7, 0.7], pos: [-3.2, 0.2, -1], color: "#FF5E5E", opacity: 0.30, rotSpeed: [0.14, 0.08] }
    ];

    cubeSettings.forEach((settings) => {
      const cube = createWireframeBox(
        settings.size[0], settings.size[1], settings.size[2],
        settings.settingsColor || settings.color,
        settings.opacity
      );
      cube.position.set(settings.pos[0], settings.pos[1], settings.pos[2]);
      
      // Store custom rotation speeds in the user data
      cube.userData = {
        rotSpeedX: settings.rotSpeed[0],
        rotSpeedY: settings.rotSpeed[1]
      };

      group.add(cube);
      cubes.push(cube);
    });

    // 6. Interactive Mouse Tracking
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 7. Animation loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const scrollProgress = scrollProgressRef.current || 0;

      // Smooth interpolation for mouse parallax
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Rotate individual cubes at their unique speeds
      cubes.forEach((cube) => {
        cube.rotation.x = elapsedTime * cube.userData.rotSpeedX;
        cube.rotation.y = elapsedTime * cube.userData.rotSpeedY;
      });

      // Parallax translation for the whole group based on scroll and mouse position
      group.position.y = (scrollProgress) * 7.5 + mouse.y * 1.2;
      group.position.x = mouse.x * 1.2;
      
      // Rotate the entire group slightly based on mouse
      group.rotation.x = mouse.y * 0.12;
      group.rotation.y = mouse.x * 0.12;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometries.forEach((geom) => geom.dispose());
      materials.forEach((mat) => mat.dispose());
      renderer.dispose();
    };
  }, [scrollProgressRef]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden" 
    />
  );
}
