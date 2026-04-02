import * as React from "react";
import { cn } from "@/lib/utils";
import { useFadeIn } from "@/hooks/use-fade-in";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "premium";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-action-manipulation";

    const variants = {
      primary: "bg-brand-gradient text-white shadow-[0_18px_40px_-22px_rgba(38,119,219,0.65)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-24px_rgba(38,119,219,0.7)]",
      secondary: "bg-gold-gradient text-[#173a77] shadow-[0_18px_36px_-22px_rgba(245,171,60,0.45)] hover:-translate-y-0.5",
      outline: "border border-border bg-white text-foreground hover:border-primary/40 hover:text-primary hover:shadow-[0_18px_40px_-28px_rgba(38,119,219,0.22)]",
      ghost: "bg-transparent text-foreground hover:bg-primary/10 hover:text-primary",
      destructive: "bg-destructive text-destructive-foreground hover:brightness-95",
      premium: "bg-[#173a77] text-white shadow-[0_22px_50px_-28px_rgba(15,41,84,0.55)] hover:bg-[#123469]",
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
        "surface-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_-34px_rgba(18,54,112,0.28)]",
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
          "flex h-12 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/12 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
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
    default: "border border-primary/12 bg-primary/10 text-primary",
    outline: "border border-border bg-white text-foreground",
    accent: "border border-amber-200 bg-amber-50 text-amber-700",
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
