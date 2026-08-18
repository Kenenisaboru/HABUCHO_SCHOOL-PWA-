/**
 * Reveal — Scroll-triggered entrance animation component.
 * Watches for intersection and animates children into view.
 * Respects prefers-reduced-motion.
 *
 * Props:
 *   children  — content to animate
 *   delay     — CSS transition delay in milliseconds (default 0)
 *   className — additional class names
 *   direction — "up" | "down" | "left" | "right" (default "up")
 */
import { useRef, useState, useEffect } from "react";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Reveal = ({ children, delay = 0, className = "", direction = "up" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const getTransform = () => {
    if (visible) return "translate(0, 0)";
    switch (direction) {
      case "up":    return "translateY(40px)";
      case "down":  return "translateY(-40px)";
      case "left":  return "translateX(40px)";
      case "right": return "translateX(-40px)";
      default:      return "translateY(40px)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(),
        transition: prefersReducedMotion ? "none" : `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;