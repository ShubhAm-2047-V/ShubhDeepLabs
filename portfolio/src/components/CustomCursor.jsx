import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Center the cursor initially
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;

      // Update CSS variables for the grid background radial glow on the root element
      document.documentElement.style.setProperty("--x", `${x}px`);
      document.documentElement.style.setProperty("--y", `${y}px`);

      // Hardware-accelerated position updates with slight lag for premium aesthetic
      gsap.to(cursor, {
        x: x,
        y: y,
        duration: 0.15,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor hidden md:block"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
