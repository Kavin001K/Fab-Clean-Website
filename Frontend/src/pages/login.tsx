import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock3, RefreshCw, ShieldCheck } from "lucide-react";
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
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
          <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="visual-card p-8 lg:p-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Fab Clean" className="h-9 w-auto" />
                <span className="eyebrow">Customer portal</span>
              </Link>
              <h1 className="mt-8 font-display text-5xl text-ink">Sign in without friction.</h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
                OTP keeps sign-in simple while the presentation stays premium and calm. One phone number, one code, one direct path into the dashboard.
              </p>
              <div className="mt-8 grid gap-4">
                {[
                  { icon: ShieldCheck, title: "Secure OTP access", body: "Phone-based sign-in keeps the flow short and keeps customer data tied to the right account." },
                  { icon: Clock3, title: "Faster repeat visits", body: "Return customers can move straight from sign-in to order tracking or pickup activity." },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-line bg-background/70 px-5 py-5">
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="mt-4 font-medium text-ink">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="visual-card p-8 lg:p-10">
              <p className="eyebrow">Portal sign-in</p>
              <AnimatePresence mode="wait">
                {step === "phone" ? (
                  <motion.div key="phone" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                    <h2 className="mt-6 font-display text-4xl text-ink">Enter your mobile number.</h2>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                      We will send a one-time code to the number linked with your customer profile.
                    </p>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        requestOtp();
                      }}
                      className="mt-8 space-y-5"
                    >
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">+91</span>
                        <Input
                          value={phone}
                          onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit number"
                          className="pl-14"
                        />
                      </div>
                      <Button type="submit" size="lg" isLoading={sendOtp.isPending}>
                        Send OTP
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="otp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                    <button type="button" onClick={() => setStep("phone")} className="text-sm font-medium text-primary">
                      Change number
                    </button>
                    <h2 className="mt-6 font-display text-4xl text-ink">Enter the OTP.</h2>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                      We sent a 6-digit code to <span className="font-medium text-ink">+91 {phone}</span>.
                    </p>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (otp.length !== 6) {
                          toast({ title: "Enter the 6-digit OTP", variant: "destructive" });
                          return;
                        }
                        verifyOtp.mutate({ data: { phone, otp } });
                      }}
                      className="mt-8 space-y-5"
                    >
                      <Input
                        value={otp}
                        onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6-digit code"
                        className="text-center text-lg tracking-[0.28em]"
                      />
                      <Button type="submit" size="lg" isLoading={verifyOtp.isPending}>Verify and sign in</Button>
                    </form>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

              <p className="mt-10 text-sm leading-7 text-muted-foreground">
                New to {BRAND.name}? After OTP verification you can complete your profile and move into the portal immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
