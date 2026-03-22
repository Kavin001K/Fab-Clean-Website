import * as React from "react";
import { cn } from "@/lib/utils";
import { useFadeIn } from "@/hooks/use-fade-in";

// --- Button ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "premium";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-2xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] uppercase tracking-[0.18em] text-[11px]";
    
    const variants = {
      primary: "bg-brand-gradient text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300",
      secondary: "bg-gold-gradient text-[#0B1C3B] shadow-lg hover:brightness-95",
      outline: "border-2 border-primary/20 bg-white/70 hover:border-primary/50 hover:text-primary transition-all duration-300",
      ghost: "hover:bg-primary/10 hover:text-primary",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      premium: "bg-[#0B1C3B] text-white hover:bg-[#122A56] shadow-2xl transition-all duration-500",
    };

    const sizes = {
      sm: "h-10 px-5",
      md: "h-14 px-8",
      lg: "h-16 px-10 text-sm",
      icon: "h-14 w-14",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// --- Card ---
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass rounded-[3.5rem] overflow-hidden transition-all duration-[800ms] hover:shadow-[0_60px_140px_-40px_rgba(11,28,59,0.16)] hover:-translate-y-3 border border-white/70", className)} {...props}>
      {children}
    </div>
  );
}

// --- Input ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-16 w-full rounded-2xl border-2 border-border/70 bg-white/80 backdrop-blur-sm px-6 py-4 text-base font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-8 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Badge ---
export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "outline" | "accent" }) {
  const variants = {
    default: "bg-primary/12 text-primary border border-primary/20",
    outline: "border border-border text-foreground",
    accent: "bg-accent text-[#C45D0E] border border-[#F47B20]/20",
  };
  
  return (
    <div className={cn("inline-flex items-center rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors", variants[variant], className)} {...props} />
  );
}

// --- Section Heading ---
export function SectionHeading({ title, subtitle, align = "center", className }: { title: string, subtitle?: string, align?: "left" | "center", className?: string }) {
  return (
    <div className={cn(
      "flex flex-col gap-8", 
      align === "center" ? "items-center text-center mx-auto max-w-5xl" : "items-start text-left", 
      className
    )}>
      {subtitle && <span className="text-secondary font-black tracking-[0.35em] uppercase text-[10px] bg-[#D6EBF7]/80 text-[#0B1C3B] px-8 py-3 rounded-full border border-[#1C88C7]/20 shadow-sm">{subtitle}</span>}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display text-foreground leading-[1.05] -tracking-[0.02em]">{title}</h2>
    </div>
  );
}

// --- Animations ---
export function FadeIn({
  children,
  delay = 0,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={cn("fade-in", className)}
      style={{ ...style, transitionDelay: `${delay}s` }}
      {...props}
    >
      {children}
    </div>
  );
}
