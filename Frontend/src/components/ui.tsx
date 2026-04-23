import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "premium";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-action-manipulation";

    const variants = {
      primary: "bg-brand-gradient text-white shadow-[0_10px_30px_-10px_rgba(8,145,178,0.4)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(8,145,178,0.5)]",
      secondary: "bg-accent-gradient text-white shadow-[0_10px_30px_-10px_rgba(34,197,94,0.4)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.5)]",
      outline: "border-2 border-primary/20 bg-white/80 text-foreground backdrop-blur-sm hover:border-primary/40 hover:bg-white hover:shadow-[0_10px_30px_-15px_rgba(8,145,178,0.25)]",
      ghost: "bg-transparent text-foreground hover:bg-primary/10 hover:text-primary",
      destructive: "bg-destructive text-destructive-foreground shadow-[0_10px_30px_-10px_rgba(239,68,68,0.3)] hover:brightness-95",
      premium: "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_10px_30px_-10px_rgba(8,145,178,0.4)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(8,145,178,0.5)]",
    };

    const sizes = {
      sm: "h-10 px-5 text-[11px] uppercase tracking-[0.14em]",
      md: "h-12 px-6 text-[11px] uppercase tracking-[0.16em]",
      lg: "h-14 px-8 text-[12px] uppercase tracking-[0.18em]",
      icon: "h-12 w-12",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
        <span className="flex items-center justify-center gap-2">{children}</span>
      </button>
    );
  },
);
Button.displayName = "Button";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/50 bg-white/80 backdrop-blur-sm shadow-[0_20px_60px_-30px_rgba(8,145,178,0.15)] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_-40px_rgba(8,145,178,0.25)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border-2 border-primary/10 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "outline" | "accent" }) {
  const variants = {
    default: "border border-primary/20 bg-primary/10 text-primary backdrop-blur-sm",
    outline: "border-2 border-primary/10 bg-white/80 text-foreground backdrop-blur-sm",
    accent: "border border-accent/20 bg-accent/10 text-accent backdrop-blur-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {subtitle ? <span className="eyebrow">{subtitle}</span> : null}
      <h2 className="max-w-4xl text-balance text-4xl font-black sm:text-5xl lg:text-6xl">{title}</h2>
    </div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
