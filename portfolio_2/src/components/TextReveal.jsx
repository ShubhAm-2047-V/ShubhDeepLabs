import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal({ children, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll(".char-inner");
    
    gsap.fromTo(
      chars,
      { y: "115%", rotateX: 15, rotateY: 5 },
      {
        y: "0%",
        rotateX: 0,
        rotateY: 0,
        duration: 1.2,
        stagger: 0.015,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 88%",
          once: true
        }
      }
    );
  }, []);

  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  return (
    <span ref={containerRef} className={`inline-block perspective-[800px] ${className}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden py-1">
          {word.split("").map((char, cIdx) => (
            <span
              key={cIdx}
              className="char-inner inline-block transform origin-bottom will-change-transform"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
