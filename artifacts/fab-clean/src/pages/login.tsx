// @ts-nocheck
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, FadeIn } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useSendOtp, useVerifyOtp } from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowRight, Phone, ShieldCheck, Sparkles, 
  ArrowLeft, RefreshCw, CheckCircle2 
} from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { setToken, isAuthenticated } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const { mutate: sendOtp, isPending: isSending } = useSendOtp({
    onSuccess: () => {
      setStep("otp");
      setResendTimer(60);
      toast({ title: "Verification code sent!", description: "Check your messages for the 6-digit PIN." });
    },
    onError: (err: any) => {
      toast({ 
        variant: "destructive", 
        title: "Failed to send code", 
        description: err.response?.data?.message || "Please check your network and try again." 
      });
    }
  });

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp({
    onSuccess: (data) => {
      setToken(data.token);
      toast({ title: "Welcome back!", description: "You have been successfully authenticated." });
    },
    onError: (err: any) => {
      toast({ 
        variant: "destructive", 
        title: "Verification failed", 
        description: err.response?.data?.message || "Invalid or expired security code." 
      });
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      setLocation(params.get("redirect") || "/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return toast({ variant: "destructive", title: "Invalid phone number" });
    sendOtp({ data: { phone } });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return toast({ variant: "destructive", title: "Invalid security code" });
    verifyOtp({ data: { phone, otp } });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      
      {/* Immersive Background Image */}
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
            <Link href="/" className="inline-block mb-16 hover:scale-105 transition-transform">
                <img src={`${import.meta.env.BASE_URL}logo.webp`} className="h-10 w-auto" alt="Logo" />
            </Link>

            <AnimatePresence mode="wait">
              {step === "phone" ? (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black font-display text-foreground leading-none -tracking-tight">Welcome <br/><span className="text-primary italic font-serif tracking-normal">Home.</span></h1>
                    <p className="text-muted-foreground text-xl font-medium">Pollachi's premium care is just a text away.</p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-8">
                    <div className="relative group/input">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 text-muted-foreground/40 group-focus-within/input:text-primary transition-colors">
                        <Phone className="w-6 h-6" />
                        <span className="text-lg font-black border-r border-border pr-3">+91</span>
                      </div>
                      <Input
                        type="tel"
                        placeholder="Mobile Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="pl-28 h-20 text-2xl font-black bg-white/40 group-focus-within/input:bg-white"
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-20 text-xs font-black shadow-2xl" isLoading={isSending}>
                      Continue <ArrowRight className="ml-4 w-6 h-6" />
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <button onClick={() => setStep("phone")} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors mb-6 group">
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary/5 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-widest">Back to Phone</span>
                  </button>

                  <div className="space-y-4">
                    <h2 className="text-5xl md:text-7xl font-black font-display text-foreground leading-none">Enter <br/><span className="text-primary italic font-serif">Code.</span></h2>
                    <p className="text-muted-foreground text-xl font-medium">We sent a 6-digit security PIN to <b>+91 {phone}</b></p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-8">
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <Input
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="pl-16 h-20 text-4xl text-center font-black tracking-[0.4em] bg-white/40 focus:bg-white"
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-20 text-xs font-black shadow-2xl" isLoading={isVerifying}>
                      Verify & Sign In <CheckCircle2 className="ml-4 w-6 h-6" />
                    </Button>
                  </form>

                  <div className="flex items-center justify-between gap-6 pt-4">
                    <p className="text-muted-foreground text-sm font-bold italic">Didn't receive it?</p>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSendOtp}
                        disabled={resendTimer > 0 || isSending}
                        className="font-black text-[10px] uppercase tracking-widest text-primary h-auto p-0 hover:bg-transparent"
                    >
                      {resendTimer > 0 ? (
                        `Resend Code (${resendTimer}s)`
                      ) : (
                        <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Resend Now
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Footer Info */}
            <div className="mt-20 pt-10 border-t border-border/50 text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                    <div className="h-px bg-border/50 w-8" />
                    <Sparkles className="w-5 h-5 text-primary opacity-50" />
                    <div className="h-px bg-border/50 w-8" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  By signing in, you agree to our <a href="#" className="underline text-foreground decoration-primary/30 decoration-2 underline-offset-4 hover:decoration-primary transition-all font-bold">Terms of Excellence</a>
                </p>
            </div>

          </div>
        </FadeIn>
      </div>

      {/* Background Decorative blobs */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[160px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
    </div>
  );
}
