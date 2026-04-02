import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useSubmitContact } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button, Card, FadeIn, Input, SectionHeading } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Please enter a short message"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { mutate: submitForm, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        toast({ title: "Message sent", description: "The team will get back to you shortly." });
        reset();
      },
      onError: () => {
        toast({ title: "Unable to send message", description: "Please try again in a moment.", variant: "destructive" });
      },
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (values: ContactForm) => {
    submitForm({ data: values });
  };

  return (
    <AppLayout>
      <SEO
        title="Contact Fab Clean"
        description="Call, WhatsApp, visit, or message Fab Clean from one clear contact page."
        canonical="https://myfabclean.com/contact"
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading title="Contact options that are easy to use" subtitle="Support" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            Use the form if the message can wait. Use phone or WhatsApp if you need help with pickup, order status, or store timing.
          </p>
        </section>

        <section className="container-wide pb-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <FadeIn>
              <Card className="p-7 sm:p-8">
                <h2 className="text-3xl font-black sm:text-4xl">Send a message</h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  Keep the message short and clear. The team can follow up by phone or email.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Input placeholder="Your name" {...register("name")} />
                      {errors.name ? <p className="mt-2 text-sm text-destructive">{errors.name.message}</p> : null}
                    </div>
                    <div>
                      <Input placeholder="Your email" {...register("email")} />
                      {errors.email ? <p className="mt-2 text-sm text-destructive">{errors.email.message}</p> : null}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input placeholder="Phone number (optional)" {...register("phone")} />
                    <Input placeholder="Subject (optional)" {...register("subject")} />
                  </div>

                  <div>
                    <textarea
                      className="min-h-[180px] w-full rounded-[1.4rem] border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/12"
                      placeholder="Tell us how we can help"
                      {...register("message")}
                    />
                    {errors.message ? <p className="mt-2 text-sm text-destructive">{errors.message.message}</p> : null}
                  </div>

                  <Button type="submit" size="lg" isLoading={isPending} className="w-full sm:w-fit">
                    Send message
                  </Button>
                </form>
              </Card>
            </FadeIn>

            <FadeIn delay={0.06} className="space-y-6">
              {[
                {
                  icon: Phone,
                  title: "Call the team",
                  lines: ["Pollachi: 93630 59595", "Kinathukadavu: 93637 19595"],
                },
                {
                  icon: Mail,
                  title: "Email",
                  lines: ["info@myfabclean.in", "myfabclean@gmail.com"],
                },
                {
                  icon: MapPin,
                  title: "Store hours",
                  lines: ["Monday to Saturday", "10:00 AM to 8:00 PM"],
                },
              ].map((item) => (
                <Card key={item.title} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{item.title}</h3>
                      <div className="mt-3 space-y-1 text-sm leading-7 text-muted-foreground">
                        {item.lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="p-6">
                <h3 className="text-xl font-black">WhatsApp support</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Best for quick pickup questions, branch timing, or order follow-up.
                </p>
                <div className="mt-5">
                  <a href="https://wa.me/919363059595" target="_blank" rel="noreferrer">
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4" />
                      Open WhatsApp
                    </Button>
                  </a>
                </div>
              </Card>
            </FadeIn>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
