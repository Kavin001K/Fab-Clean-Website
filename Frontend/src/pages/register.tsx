// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { CheckCircle2, Mail, User } from "lucide-react";
import { useUpdateProfile } from "@workspace/api-client-react";
import { Button, Card, FadeIn, Input } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export default function Register() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const updateProfile = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        toast({ title: "Profile saved", description: "Your customer profile is ready." });
        setLocation("/dashboard/profile");
      },
      onError: (error: any) => {
        toast({
          title: "Unable to save profile",
          description: error.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    if (!isAuthenticated) setLocation("/login?redirect=%2Fregister");
  }, [isAuthenticated, setLocation]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }

    updateProfile.mutate({ data: { name, email } });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <FadeIn>
            <Card className="p-6 sm:p-8 lg:p-10">
              <h1 className="mt-5 text-4xl font-black sm:text-5xl lg:text-6xl">Complete your profile.</h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Tell us a bit more about yourself to personalize your experience and manage your orders effectively.
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  "Use the same name you want on your customer account.",
                  "Email is optional, but helpful for future updates.",
                  "Phone number stays locked because sign-in is tied to OTP.",
                ].map((item) => (
                  <div key={item} className="surface-soft px-4 py-4 text-sm leading-7 text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.08}>
            <Card className="p-6 sm:p-8 lg:p-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Fab Clean logo" className="h-9 w-auto" />
              </Link>

              <h2 className="mt-8 text-3xl font-black sm:text-4xl">Personalize your profile</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Almost there! Just a few more details before you move into your dashboard.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-foreground">Full name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={name} onChange={(event) => setName(event.target.value)} className="pl-11" placeholder="Your name" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-foreground">Email (optional)</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={email} onChange={(event) => setEmail(event.target.value)} className="pl-11" placeholder="you@example.com" />
                  </div>
                </div>

                <Button type="submit" size="lg" isLoading={updateProfile.isPending} className="w-full justify-center">
                  Complete profile
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
