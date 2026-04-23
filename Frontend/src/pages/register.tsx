import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, User } from "lucide-react";
import { useUpdateProfile } from "@workspace/api-client-react";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/seo";

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

  return (
    <>
      <SEO
        title="Complete Profile | Fab Clean"
        description="Complete your Fab Clean customer profile after OTP sign-in."
        canonical="https://myfabclean.com/register"
      />
      <div className="site-frame min-h-screen px-4 py-6 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center">
          <div className="grid w-full gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="visual-card p-8 lg:p-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Fab Clean" className="h-9 w-auto" />
                <span className="eyebrow">Profile completion</span>
              </Link>
              <h1 className="mt-8 font-display text-5xl text-ink">Finish the customer profile.</h1>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                This screen is intentionally stripped down. The goal is to capture only what improves the experience without introducing unnecessary friction.
              </p>
            </div>

            <div className="visual-card p-8 lg:p-10">
              <h2 className="font-display text-4xl text-ink">Complete the basics.</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Name helps identify the customer record. Email is optional but useful for future service updates.
              </p>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (name.trim().length < 2) {
                    toast({ title: "Please enter your name", variant: "destructive" });
                    return;
                  }
                  updateProfile.mutate({ data: { name, email } });
                }}
                className="mt-8 space-y-5"
              >
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={name} onChange={(event) => setName(event.target.value)} className="pl-11" placeholder="Your name" />
                </div>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={email} onChange={(event) => setEmail(event.target.value)} className="pl-11" placeholder="you@example.com" />
                </div>
                <Button type="submit" size="lg" isLoading={updateProfile.isPending}>Complete profile</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
