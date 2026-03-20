import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button, Card, FadeIn, Input } from "@/components/ui";
import { useSendOtp, useVerifyOtp } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const { setToken } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [shake, setShake] = useState(false);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: reqOtp, isPending: sending } = useSendOtp({
    mutation: {
      onSuccess: () => setStep(2),
      onError: (err) => toast({ title: "Error", description: err.error?.message || "Failed to send OTP", variant: "destructive" })
    }
  });

  const { mutate: verify, isPending: verifying } = useVerifyOtp({
    mutation: {
      onSuccess: (data) => {
        setToken(data.data.accessToken);
        if (data.data.isNewUser) {
          setLocation("/register");
        } else {
          setLocation("/dashboard");
        }
      },
      onError: () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    }
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    reqOtp({ data: { phone } });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (step === 2 && otp.every(v => v !== "")) {
      verify({ data: { phone, otp: otp.join("") } });
    }
  }, [otp, step, phone, verify]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted relative overflow-hidden p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/8 blur-3xl rounded-full pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 z-10">
        <img
          src={`${import.meta.env.BASE_URL}logo.webp`}
          alt="Fab Clean"
          className="h-10 w-auto"
        />
      </Link>

      <FadeIn className="w-full max-w-md relative z-10">
        <Card className="p-8 shadow-xl border-border">
          {step === 1 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Welcome back</h2>
              <p className="text-muted-foreground mb-8">Enter your phone number to receive a secure OTP.</p>
              
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">+91</span>
                  <Input 
                    type="tel" 
                    placeholder="Enter mobile number" 
                    className="pl-12 font-medium tracking-wider text-lg h-14"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full h-14 text-lg" isLoading={sending} disabled={phone.length !== 10}>
                  Send OTP
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: shake ? [-10, 10, -10, 10, 0] : 0 }} 
              transition={{ x: { duration: 0.4 } }}
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Verify OTP</h2>
              <p className="text-muted-foreground mb-8">Code sent to +91 {phone}. <button onClick={() => setStep(1)} className="text-primary hover:underline">Edit</button></p>

              <div className="flex gap-2 justify-between mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-xl bg-white border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 text-foreground transition-all outline-none shadow-sm"
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>
              
              <Button className="w-full h-14 text-lg" isLoading={verifying} disabled={!otp.every(v => v)}>
                Verify & Proceed
              </Button>
            </motion.div>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}
