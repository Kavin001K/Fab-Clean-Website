import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Card, FadeIn, SectionHeading } from "@/components/ui";
import { CheckCircle2, MapPin, ShieldCheck, Shirt } from "lucide-react";

export default function About() {
  return (
    <AppLayout>
      <SEO
        title="About Fab Clean"
        description="Learn what Fab Clean does, where the branches operate, and how the service is designed to be clear and reliable."
        canonical="https://myfabclean.com/about"
      />

      <div className="page-shell">
        <section className="container-tight section-padding">
          <SectionHeading title="Your partner in premium garment care" subtitle="About us" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            We are dedicated to providing high-quality laundry and dry cleaning with transparent communication and reliable service. Our goal is to make garment care simple, organized, and worry-free for every customer.
          </p>
        </section>

        <section className="container-wide pb-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <FadeIn>
              <Card className="h-full p-7 sm:p-8">
                <Badge>Our Vision</Badge>
                <h2 className="mt-5 text-4xl font-black sm:text-5xl">Care, clarity, and consistency</h2>
                <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                  <p>We believe that garment care should be a seamless experience. You should always know the status of your order and feel confident in the quality of service you receive.</p>
                  <p>By combining traditional expertise with modern convenience, we provide a service that respects your time and your wardrobe.</p>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.06}>
              <Card className="h-full p-7 sm:p-8">
                <div className="space-y-5">
                  {[
                    {
                      icon: Shirt,
                      title: "Special garment handling",
                      text: "Dry cleaning and premium care for garments that should not go through a normal wash cycle.",
                    },
                    {
                      icon: CheckCircle2,
                      title: "Real-time order tracking",
                      text: "Stay updated on your order progress and share your feedback directly through our platform.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Secure and easy access",
                      text: "Quick sign-in with your phone number ensures your account remains private and easy to manage.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="surface-soft p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>
          </div>
        </section>

        <section className="container-wide pb-20">
          <SectionHeading title="Current branch locations" subtitle="Where service is available" />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              {
                title: "Pollachi branch",
                address: "#16, Venkatramana Round Road, Opposite Naturals / HDFC Bank, Mahalingapuram, Pollachi - 642002",
                phone: "93630 59595",
              },
              {
                title: "Kinathukadavu branch",
                address: "#442/11, Opposite MLA Office, Krishnasamypuram, Kinathukadavu - 642109",
                phone: "93637 19595",
              },
            ].map((branch, index) => (
              <FadeIn key={branch.title} delay={index * 0.05}>
                <Card className="h-full p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">{branch.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{branch.address}</p>
                      <p className="mt-3 text-sm font-bold text-foreground">Phone: {branch.phone}</p>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
