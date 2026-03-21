import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BubbleProps {
  x: number;
  y: number;
  size: number;
  id: number;
}

const Bubble: React.FC<BubbleProps> = ({ x, y, size }) => {
  return (
    <motion.div
      initial={{ x, y: y, scale: 0, opacity: 0.8 }}
      animate={{ 
        y: y - 120, // Float upwards
        x: x + (Math.random() - 0.5) * 60, // Slight horizontal drift
        scale: [0, 1.3, 0.7], 
        opacity: 0 
      }}
      transition={{ duration: 2.2, ease: "easeOut" }}
      className="absolute pointer-events-none rounded-full border border-white/40"
      style={{
        width: size,
        height: size,
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(6px)",
        boxShadow: "inset 0 0 12px rgba(255, 255, 255, 0.6)",
        zIndex: 10,
        left: 0,
        top: 0,
      }}
    />
  );
};

interface FoamContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const FoamContainer: React.FC<FoamContainerProps> = ({ children, className }) => {
  const [bubbles, setBubbles] = useState<BubbleProps[]>([]);

  const addBubble = (e: React.MouseEvent) => {
    // Only spawn bubbles occasionally to save performance (10% chance per movement event)
    if (Math.random() > 0.15) return; 

    // Get coordinates relative to the container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBubble: BubbleProps = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.random() * 25 + 8,
    };

    setBubbles((prev) => [...prev.slice(-25), newBubble]); // Keep max 25 bubbles for performance
  };

  // Clean up bubbles that have finished animating
  useEffect(() => {
    const timer = setInterval(() => {
      setBubbles((prev) => prev.filter(b => Date.now() - b.id < 2500));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      onMouseMove={addBubble} 
      className={`relative inline-block overflow-visible ${className || ""}`}
    >
      <AnimatePresence>
        {bubbles.map((b) => (
          <Bubble key={b.id} {...b} />
        ))}
      </AnimatePresence>
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};
