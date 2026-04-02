import { Link } from "wouter";
import { useListServices } from "@workspace/api-client-react";
import { ArrowRight, BriefcaseBusiness, Loader2, Shirt, Sparkles, WashingMachine } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, SectionHeading } from "@/components/ui";

const iconMap: Record<string, typeof Shirt> = {
  shirt: Shirt,
  briefcase: BriefcaseBusiness,
  zap: Sparkles,
  laundry: WashingMachine,
};

export default function Services() {
  const { data, isLoading } = useListServices();

  return (
    <AppLayout>
      <SEO
        title="Services | Fab Clean"
        description="See Fab Clean service categories, what each one includes, who it is best for, and where to start."
        canonical="https://myfabclean.com/services"
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading
            title="Garment care for every occasion"
            subtitle="Our Services"
          />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            Explore our professional laundry and dry cleaning options. Each service is tailored to provide the best care for your garments, ensuring they look and feel their best.
          </p>
        </section>

        <section className="container-wide pb-20">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {data?.data?.map((service, index) => {
                const Icon = iconMap[service.icon?.toLowerCase() || ""] || Shirt;
                const bestFor = service.features?.[0] || "Daily wear and common garment care needs";
                const includes = service.features?.slice(0, 3) || [];

                return (
                  <FadeIn key={service.id} delay={index * 0.05}>
                    <Card className="flex h-full flex-col p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-7 w-7" />
                        </div>
                        <Badge variant="accent">From ₹{service.startingPrice}</Badge>
                      </div>

                      <h2 className="mt-6 text-3xl font-black">{service.name}</h2>
                      <p className="mt-4 text-base leading-7 text-muted-foreground">{service.description}</p>

                      <div className="mt-6 rounded-[1.25rem] bg-muted/70 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Best for</p>
                        <p className="mt-2 text-sm leading-7 text-foreground">{bestFor}</p>
                      </div>

                      <div className="mt-6 flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">What is usually included</p>
                        <div className="mt-3 space-y-3">
                          {includes.length ? includes.map((item) => (
                            <div key={item} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                              <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                              <span>{item}</span>
                            </div>
                          )) : (
                            <p className="text-sm leading-7 text-muted-foreground">Inspection, appropriate cleaning, and careful handling based on the garment type.</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href="/schedule-pickup">
                          <Button className="w-full">
                            Book this service
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href="/pricing">
                          <Button variant="outline" className="w-full">
                            View pricing
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </section>

        <section className="container-wide pb-20">
          <FadeIn>
            <Card className="bg-brand-gradient p-7 text-white sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-white/80">Still not sure?</p>
                  <h2 className="mt-4 text-4xl font-black sm:text-5xl">Ready to give your garments the care they deserve?</h2>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
                    If you have questions about a specific item or need custom care, our team is here to help. Reach out to us or schedule a pickup today.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link href="/contact">
                    <Button variant="secondary" className="w-full">Talk to the team</Button>
                  </Link>
                  <Link href="/schedule-pickup">
                    <Button variant="outline" className="w-full border-white/25 bg-white/10 text-white hover:bg-white/16">
                      Schedule pickup
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </FadeIn>
        </section>
      </div>
    </AppLayout>
  );
}
