import { AppLayout } from "@/components/layout";
import { SectionHeading, FadeIn, Card, Input, Button } from "@/components/ui";
import { useSubmitContact } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { mutate: submitForm, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        toast({ title: "Message Sent", description: "We'll get back to you shortly." });
        reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
      }
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactForm) => {
    submitForm({ data });
  };

  return (
    <AppLayout>
      <div className="relative pt-32 pb-24 container-wide overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary/10 rounded-full blur-[200px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-secondary/7 rounded-full blur-[180px] -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <SectionHeading 
            title="Get in Touch" 
            subtitle="We're here to help"
            className="mb-16"
          />

          <div className="grid lg:grid-cols-2 gap-12">
            <FadeIn>
              <Card className="p-8 border-border shadow-sm">
                <h3 className="text-2xl font-display font-bold text-foreground mb-6">Send us a message</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input placeholder="Your Name *" {...register("name")} />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Input placeholder="Your Email *" {...register("email")} />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Phone Number" {...register("phone")} />
                    <Input placeholder="Subject" {...register("subject")} />
                  </div>
                  <div>
                    <textarea 
                      className="flex min-h-[120px] w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all resize-none"
                      placeholder="Your Message *"
                      {...register("message")}
                    />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" isLoading={isPending} className="w-full">Send Message</Button>
                </form>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2} className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-foreground font-bold text-lg mb-1">Call Us</h4>
                  <p className="text-muted-foreground">Pollachi: 93630 59595</p>
                  <p className="text-muted-foreground">Kinathukadavu: 93637 19595</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-foreground font-bold text-lg mb-1">Email Us</h4>
                  <p className="text-muted-foreground">info@myfabclean.in</p>
                  <p className="text-muted-foreground">myfabclean@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-foreground font-bold text-lg mb-1">Visit Us</h4>
                  <p className="text-muted-foreground mb-4">Monday – Saturday: 10:00 AM – 8:00 PM<br/>Sunday: Closed</p>

                  <div className="w-full h-48 bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground text-sm">
                    Google Maps — Pollachi Branch
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
