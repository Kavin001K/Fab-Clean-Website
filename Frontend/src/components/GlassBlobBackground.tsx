import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassBlobBackgroundProps {
  className?: string;
  count?: number;
  colors?: string[];
}

export function GlassBlobBackground({
  className,
  count = 5,
  colors = ["#0891B2", "#22D3EE", "#22C55E"]
}: GlassBlobBackgroundProps) {
  // Generate random blobs as divs with gradient and blur
  const blobs = Array.from({ length: count }, (_, i) => {
    const size = 200 + Math.random() * 300;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const color = colors[i % colors.length];
    const opacity = 0.08 + Math.random() * 0.07;
    const blur = 60 + Math.random() * 40;

    return { size, x, y, color, opacity, blur };
  });

  return (
    <div className={cn("absolute inset-0 overflow-hidden -z-10", className)}>
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            opacity: blob.opacity,
            filter: `blur(${blob.blur}px)`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, Math.sin(i) * 20, 0],
            y: [0, Math.cos(i) * 20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${colors[0]}15, transparent 40%),
                      radial-gradient(circle at 70% 80%, ${colors[1]}15, transparent 40%),
                      radial-gradient(circle at 50% 50%, ${colors[2]}10, transparent 30%)`,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}