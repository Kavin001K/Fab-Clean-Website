// @ts-nocheck
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Button, Input, FadeIn } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfile } from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowRight, User, Sparkles, 
  ArrowLeft, CheckCircle2, Star, ShieldCheck
} from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, setToken } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { mutate: update, isPending } = useUpdateProfile({
    onSuccess: () => {
      toast({ title: "Welcome aboard!", description: "Your profile has been set up successfully." });
      setLocation("/dashboard");
    },
    onError: (err: any) => {
      toast({ 
        variant: "destructive", 
        title: "Registration failed", 
        description: err.response?.data?.message || "Something went wrong. Please try again." 
      });
    }
  });

  // If not authenticated, redirected to login first
  // In a real app, the token should already be in the context from the successful OTP step
  useEffect(() => {
    if (!isAuthenticated) {
      // Small timeout to allow state to settle
      const t = setTimeout(() => {
        if (!isAuthenticated) setLocation("/login");
      }, 500);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast({ variant: "destructive", title: "Invalid Name" });
    update({ data: { name, email } });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      
      {/* Immersive Background Image (Matches Login) */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source
            srcSet={`${import.meta.env.BASE_URL}images/auth-bg.webp`}
            type="image/webp"
          />
          <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
              className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply"
              loading="lazy"
              decoding="async"
              alt=""
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-primary/10 backdrop-blur-3xl" />
      </div>

      <div className="container relative z-10 p-6 flex items-center justify-center">
        <FadeIn className="w-full max-w-xl">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[4rem] p-10 md:p-20 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] border border-white/50 relative overflow-hidden group">
            
            {/* Logo area */}
            <Link href="/" className="inline-block mb-16 hover:scale-105 transition-transform z-20">
                <img src={`${import.meta.env.BASE_URL}logo.webp`} className="h-10 w-auto" alt="Logo" />
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-12 relative z-10"
            >
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black font-display text-foreground leading-none">Almost <br/><span className="text-primary italic font-serif">Aboard.</span></h1>
                    <p className="text-muted-foreground text-xl font-medium">Define your personalized care preferences below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-8">
                        <div className="relative group/input">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors">
                                <User className="w-6 h-6" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-16 h-20 text-2xl font-black bg-white/40 focus:bg-white transition-all shadow-sm"
                                required
                            />
                        </div>

                        <div className="relative group/input">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <Input
                                type="email"
                                placeholder="Email (Optional)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-16 h-20 text-2xl font-black bg-white/40 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full h-24 text-xs font-black shadow-2xl group" isLoading={isPending}>
                        Complete Your Profile <CheckCircle2 className="ml-4 w-6 h-6 group-hover:scale-125 transition-transform" />
                    </Button>
                </form>

                <div className="pt-10 border-t border-border/50 text-center space-y-8">
                    <div className="flex items-center justify-center gap-2">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-primary text-primary opacity-50" />)}
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                        Joining the 1,200+ households who've discovered the <span className="text-foreground decoration-primary/30 decoration-2 underline-offset-4 hover:decoration-primary transition-all font-bold">Fab Clean Standard</span>.
                    </p>
                </div>
            </motion.div>

            {/* Background Decor */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors pointer-events-none" />
          </div>
        </FadeIn>
      </div>

      {/* Decorative page-wide light effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
