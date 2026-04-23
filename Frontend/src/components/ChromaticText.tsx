import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChromaticTextProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  hoverIntensity?: number;
}

export function ChromaticText({
  children,
  className,
  intensity = 0.5,
  hoverIntensity = 1.5,
}: ChromaticTextProps) {
  return (
    <motion.span
      className={cn("relative inline-block", className)}
      whileHover={{
        textShadow: `
          ${hoverIntensity}px 0 rgba(255, 0, 0, 0.7),
          -${hoverIntensity}px 0 rgba(0, 255, 255, 0.7),
          0 ${hoverIntensity}px rgba(0, 255, 0, 0.7)
        `,
        transition: { duration: 0.3 },
      }}
      style={{
        textShadow: `
          ${intensity}px 0 rgba(255, 0, 0, 0.5),
          -${intensity}px 0 rgba(0, 255, 255, 0.5),
          0 ${intensity}px rgba(0, 255, 0, 0.5)
        `,
      }}
    >
      {children}
    </motion.span>
  );
}