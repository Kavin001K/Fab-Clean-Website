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
          <SectionHeading title="A simpler story about what Fab Clean does" subtitle="About us" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            Fab Clean was built to make garment care feel more dependable. The goal is straightforward: keep service quality high, keep communication clear, and make it easier for customers to know what is happening to their order.
          </p>
        </section>

        <section className="container-wide pb-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <FadeIn>
              <Card className="h-full p-7 sm:p-8">
                <Badge>How we think about service</Badge>
                <h2 className="mt-5 text-4xl font-black sm:text-5xl">Care, clarity, and consistency</h2>
                <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                  <p>Customers should not need to guess what service to choose, what the status means, or whether the team received their feedback.</p>
                  <p>The website and ERP now work together so store operations, billing, order progress, and customer feedback can stay aligned in one system.</p>
                  <p>That means the public website can feel simple, while the operational side still has the detail the store needs.</p>
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
                      title: "Order tracking and feedback",
                      text: "Customers can track orders by identifier and submit order-linked reviews after service.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Customer access with OTP",
                      text: "Phone OTP sign-in keeps access tied to the customer record without adding a separate password system.",
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
