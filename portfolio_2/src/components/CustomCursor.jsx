import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // Disable custom cursor on mobile

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e) => {
      setHidden(false);
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: "power2.out"
      });
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Setup interactive hover classes
    const labelText = ring.querySelector("#cursor-label-text");

    const onHoverEnter = (e) => {
      const target = e.currentTarget;
      const label = target.getAttribute("data-cursor-label");
      
      if (label) {
        if (labelText) {
          labelText.innerText = label;
          gsap.to(labelText, { opacity: 1, duration: 0.2 });
        }
        gsap.to(ring, {
          scale: 3.5,
          borderRadius: "50%",
          borderColor: "rgba(255, 255, 255, 1)",
          backgroundColor: "rgba(255, 255, 255, 1)",
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.2
        });
      } else {
        gsap.to(ring, {
          scale: 1.6,
          borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%", // Organic fluid morphing!
          borderColor: "rgba(255, 255, 255, 0.65)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(dot, {
          scale: 0.4,
          duration: 0.2
        });
      }
    };

    const onHoverLeave = () => {
      if (labelText) {
        gsap.to(labelText, { 
          opacity: 0, 
          duration: 0.15, 
          onComplete: () => {
            labelText.innerText = "";
          }
        });
      }
      gsap.to(ring, {
        scale: 1,
        borderRadius: "50%",
        borderColor: "rgba(255, 255, 255, 0.25)",
        backgroundColor: "transparent",
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.2
      });
    };

    const attachHoverListeners = () => {
      const elements = document.querySelectorAll("a, button, [role='button'], .interactive-card, [data-cursor-label]");
      elements.forEach((el) => {
        el.addEventListener("mouseenter", onHoverEnter);
        el.addEventListener("mouseleave", onHoverLeave);
      });
    };

    attachHoverListeners();

    // Re-attach on scroll or DOM mutation to ensure new dynamic elements get hover states
    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef} 
        className="cursor-dot hidden md:block" 
        style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.15s ease" }}
      />
      <div 
        ref={ringRef} 
        className="cursor-ring hidden md:block flex items-center justify-center text-[7px] font-mono font-bold tracking-widest text-black uppercase pointer-events-none whitespace-nowrap overflow-hidden"
        style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.15s ease" }}
      >
        <span id="cursor-label-text" className="opacity-0 transition-opacity duration-200"></span>
      </div>
    </>
  );
}
