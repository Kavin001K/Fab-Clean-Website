import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useSendOtp, useVerifyOtp } from "@workspace/api-client-react";
import { Button, Input } from "@/components/ui";
import { BRAND } from "@/lib/brand";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/seo";

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
        toast({ title: "Code sent", description: "Check your messages for the 4-digit OTP." });
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
        setToken(result.data.accessToken);
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

  return (
    <>
      <SEO
        title="Login | Fab Clean"
        description="Sign in to the Fab Clean customer portal with OTP."
        canonical="https://myfabclean.com/login"
      />
      <div className="site-frame min-h-screen px-4 py-6 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center">
          <div className="w-full">
            <div className="visual-card p-8 lg:p-10">
              <div className="flex justify-center mb-10">
                <Link href="/" className="inline-flex items-center gap-3">
                  <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Fab Clean" className="h-10 w-auto" />
                </Link>
              </div>

              <p className="eyebrow text-center">Customer portal</p>
              <AnimatePresence mode="wait">
                {step === "phone" ? (
                  <motion.div key="phone" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="text-center">
                    <h2 className="mt-4 font-display text-3xl text-ink">Sign in</h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      We will send a one-time code to your mobile number.
                    </p>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        requestOtp();
                      }}
                      className="mt-8 space-y-5"
                    >
                      <div className="relative text-left">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">+91</span>
                        <Input
                          value={phone}
                          onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit number"
                          className="pl-14 text-center"
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg" isLoading={sendOtp.isPending}>
                        Send OTP
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="otp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="text-center">
                    <button type="button" onClick={() => setStep("phone")} className="text-sm font-medium text-primary">
                      Change number
                    </button>
                    <h2 className="mt-4 font-display text-3xl text-ink">Enter code</h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      We sent a 4-digit code to <span className="font-medium text-ink">+91 {phone}</span>.
                    </p>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (otp.length !== 4) {
                          toast({ title: "Enter the 4-digit OTP", variant: "destructive" });
                          return;
                        }
                        verifyOtp.mutate({ data: { phone, otp } });
                      }}
                      className="mt-8 space-y-5"
                    >
                      <Input
                        value={otp}
                        onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="4-digit code"
                        className="text-center text-lg tracking-[0.28em]"
                      />
                      <Button type="submit" className="w-full" size="lg" isLoading={verifyOtp.isPending}>Verify and sign in</Button>
                    </form>
                    <div className="mt-6 flex flex-col items-center gap-3">
                      <p className="text-sm text-muted-foreground">
                        {resendTimer ? `Resend available in ${resendTimer}s` : "Need a new code?"}
                      </p>
                      <Button type="button" variant="ghost" size="sm" disabled={resendTimer > 0 || sendOtp.isPending} onClick={requestOtp}>
                        <RefreshCw className="h-4 w-4" />
                        Resend OTP
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-10 text-center text-sm leading-7 text-muted-foreground">
                New to {BRAND.name}? We'll create your account automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
