import React, { useState, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";

// --- Character-Level Liquid Physics ---

interface LiquidLetterProps {
  char: string;
  className?: string;
}

const LiquidLetter: React.FC<LiquidLetterProps> = ({ char, className }) => {
  const x = useSpring(0, { stiffness: 200, damping: 10 });
  const y = useSpring(0, { stiffness: 200, damping: 10 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Displacement strength: 0.5 makes it follow the mouse slightly
    x.set(mouseX * 0.5);
    y.set(mouseY * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, display: "inline-block" }}
      className={`cursor-pointer select-none ${className || ""}`}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

interface LiquidTextResponsiveProps {
  text: string;
  className?: string;
  letterClassName?: string;
}

export const LiquidTextResponsive: React.FC<LiquidTextResponsiveProps> = ({ text, className, letterClassName }) => {
  return (
    <div className={`flex flex-wrap ${className || ""}`}>
      {text.split(" ").map((word, wIdx, arr) => (
        <React.Fragment key={wIdx}>
          <div className="flex whitespace-nowrap">
            {word.split("").map((char, i) => (
              <LiquidLetter key={i} char={char} className={letterClassName} />
            ))}
          </div>
          {wIdx < arr.length - 1 && (
            <div className="flex whitespace-nowrap">
              <LiquidLetter char=" " className={letterClassName} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- Foam / Bubble Particle System ---

interface BubbleProps {
  id: number;
  x: number;
  y: number;
}

const Bubble: React.FC<BubbleProps> = ({ x, y }) => (
  <motion.div
    initial={{ opacity: 0.8, scale: 0, x, y }}
    animate={{ 
      opacity: 0, 
      scale: 1.5, 
      y: y - 80, // Float up more for better visibility
      x: x + (Math.random() - 0.5) * 40 
    }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    className="absolute w-4 h-4 bg-white/30 rounded-full blur-[2px] pointer-events-none border border-white/20"
    style={{ left: 0, top: 0, zIndex: 10 }}
  />
);

interface LaundryTextProps {
  children: React.ReactNode;
  className?: string;
}

export const LaundryText: React.FC<LaundryTextProps> = ({ children, className }) => {
  const [bubbles, setBubbles] = useState<BubbleProps[]>([]);

  const spawnFoam = (e: React.MouseEvent) => {
    // Only spawn bubbles occasionally to save performance
    if (Math.random() > 0.2) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const newBubble: BubbleProps = {
      id: Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setBubbles((prev) => [...prev.slice(-20), newBubble]);
    
    // Auto-clean bubbles
    setTimeout(() => {
        setBubbles((prev) => prev.filter(b => b.id !== newBubble.id));
    }, 1200);
  };

  return (
    <div className={`relative inline-block group ${className || ""}`} onMouseMove={spawnFoam}>
      <AnimatePresence>
        {bubbles.map((b) => (
          <Bubble key={b.id} x={b.x} y={b.y} id={b.id} />
        ))}
      </AnimatePresence>
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};
