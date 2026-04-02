// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, Phone, RefreshCw, ShieldCheck } from "lucide-react";
import { useSendOtp, useVerifyOtp } from "@workspace/api-client-react";
import { Button, Card, FadeIn, Input } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, setToken } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const redirectTarget = useMemo(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    return params.get("redirect") || "/dashboard/orders";
  }, [location]);

  const sendOtp = useSendOtp({
    mutation: {
      onSuccess: () => {
        setStep("otp");
        setResendTimer(60);
        toast({ title: "Code sent", description: "Check your messages for the 6-digit OTP." });
      },
      onError: (error: any) => {
        toast({
          title: "Unable to send code",
          description: error.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      },
    },
  });

  const verifyOtp = useVerifyOtp({
    mutation: {
      onSuccess: (result) => {
        setToken(result.token);
        toast({ title: "Signed in", description: "You are now logged in." });
      },
      onError: (error: any) => {
        toast({
          title: "Verification failed",
          description: error.response?.data?.message || "Please check the OTP and try again.",
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    if (isAuthenticated) setLocation(redirectTarget);
  }, [isAuthenticated, redirectTarget, setLocation]);

  useEffect(() => {
    if (!resendTimer) return;
    const timer = window.setTimeout(() => setResendTimer((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendTimer]);

  const requestOtp = () => {
    if (phone.length !== 10) {
      toast({ title: "Enter a valid phone number", description: "Use a 10-digit mobile number.", variant: "destructive" });
      return;
    }
    sendOtp.mutate({ data: { phone } });
  };

  const handleSendOtp = (event: React.FormEvent) => {
    event.preventDefault();
    requestOtp();
  };

  const handleVerifyOtp = (event: React.FormEvent) => {
    event.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Enter the 6-digit OTP", variant: "destructive" });
      return;
    }
    verifyOtp.mutate({ data: { phone, otp } });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <FadeIn className="order-2 lg:order-1">
            <Card className="p-6 sm:p-8 lg:p-10">
              <h1 className="mt-5 text-4xl font-black sm:text-5xl lg:text-6xl">Sign in to your account.</h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Enter your phone number to access your order history, track current items, and manage your account settings quickly and securely.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Phone, label: "Enter phone" },
                  { icon: ShieldCheck, label: "Verify OTP" },
                  { icon: CheckCircle2, label: "Open dashboard" },
                ].map((item) => (
                  <div key={item.label} className="surface-soft p-4 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.08} className="order-1 lg:order-2">
            <Card className="p-6 sm:p-8 lg:p-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Fab Clean logo" className="h-9 w-auto" />
              </Link>

              <AnimatePresence mode="wait">
                {step === "phone" ? (
                  <motion.div key="login-phone" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <h2 className="mt-8 text-3xl font-black sm:text-4xl">Enter your phone number</h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">We will send a one-time code to this number.</p>

                    <form onSubmit={handleSendOtp} className="mt-8 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-foreground">Mobile number</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">+91</span>
                          <Input
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder="10-digit number"
                            className="pl-14"
                          />
                        </div>
                      </div>
                      <Button type="submit" size="lg" isLoading={sendOtp.isPending} className="w-full justify-center">
                        Send OTP
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="login-otp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <button type="button" onClick={() => setStep("phone")} className="text-sm font-bold text-primary">
                      Change number
                    </button>
                    <h2 className="mt-4 text-3xl font-black sm:text-4xl">Enter the OTP</h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      We sent a 6-digit code to <span className="font-bold text-foreground">+91 {phone}</span>.
                    </p>

                    <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-foreground">OTP</label>
                        <Input
                          type="text"
                          value={otp}
                          onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="6-digit code"
                          className="text-center text-lg tracking-[0.28em]"
                        />
                      </div>
                      <Button type="submit" size="lg" isLoading={verifyOtp.isPending} className="w-full justify-center">
                        Verify and sign in
                      </Button>
                    </form>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock3 className="h-4 w-4 text-primary" />
                        <span>{resendTimer ? `Resend available in ${resendTimer}s` : "Did not get the code?"}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="justify-center sm:w-auto"
                        disabled={resendTimer > 0 || sendOtp.isPending}
                        onClick={requestOtp}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Resend OTP
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-8 text-sm leading-7 text-muted-foreground">
                New to Fab Clean? After OTP verification, you can complete your profile and continue to the dashboard.
              </p>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
