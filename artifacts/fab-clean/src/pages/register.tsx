import { useState } from "react";
import { useLocation } from "wouter";
import { Button, Card, FadeIn, Input } from "@/components/ui";
import { useUpdateProfile } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/use-auth";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { profile, isLoading } = useRequireAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { mutate: update, isPending } = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        toast({ title: "Profile complete!", description: "Welcome to Fab Clean." });
        setLocation("/dashboard");
      },
      onError: () => toast({ title: "Error", description: "Could not save profile", variant: "destructive" })
    }
  });

  if (isLoading || !profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    update({ data: { name, email: email || undefined } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative p-4">
      <FadeIn className="w-full max-w-md relative z-10">
        <Card className="p-8">
          <h2 className="text-3xl font-display font-bold text-white mb-2">Complete Profile</h2>
          <p className="text-muted-foreground mb-8">Just a few details to set up your account.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Full Name *</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe" 
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Email Address (Optional)</label>
              <Input 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="john@example.com" 
              />
            </div>
            <Button type="submit" className="w-full h-12 mt-4" isLoading={isPending} disabled={!name.trim()}>
              Finish Setup
            </Button>
          </form>
        </Card>
      </FadeIn>
    </div>
  );
}
