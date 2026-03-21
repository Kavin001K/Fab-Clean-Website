import React, { useRef } from "react";
import { motion, useSpring } from "framer-motion";

interface LiquidTextProps {
  children: React.ReactNode;
  className?: string;
}

export const LiquidText: React.FC<LiquidTextProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Use springs for that "smooth/liquid" feel
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();

    // Calculate mouse position relative to center of the text
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Adjust the '0.3' to increase or decrease the "liquid" pull range
    const moveX = (clientX - centerX) * 0.3;
    const moveY = (clientY - centerY) * 0.3;

    x.set(moveX);
    y.set(moveY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block cursor-default ${className || ""}`}
    >
      {children}
    </motion.div>
  );
};
