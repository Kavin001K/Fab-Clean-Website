import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface IridescentBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  speed?: number;
}

export function IridescentBorder({
  children,
  className,
  borderWidth = 2,
  speed = 5,
}: IridescentBorderProps) {
  return (
    <div className={cn("relative rounded-3xl", className)}>
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `linear-gradient(45deg,
            #0891B2, #22D3EE, #22C55E, #0891B2
          )`,
          backgroundSize: "300% 300%",
          padding: `${borderWidth}px`,
          margin: `-${borderWidth}px`,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />
      <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}