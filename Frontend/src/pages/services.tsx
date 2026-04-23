import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useListServices } from "@workspace/api-client-react";
import { Footprints, Gem, Layout, Loader2, Shirt, Sparkles, WashingMachine, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, SectionHeading } from "@/components/ui";
import { StoryCard, SupportBand } from "@/components/site";

const iconMap = {
  shirt: Shirt,
  "washing-machine": WashingMachine,
  scale: WashingMachine,
  footprints: Footprints,
  layout: Layout,
  gem: Gem,
  zap: Zap,
  sparkles: Sparkles,
} as const;

export default function Services() {
  const { data, isLoading } = useListServices();
  const [filter, setFilter] = useState("All");

  const groups = useMemo(() => {
    const items = data?.data ?? [];
    return {
      All: items,
      Laundry: items.filter((service) => !service.name.toLowerCase().includes("dry")),
      "Dry Cleaning": items.filter((service) => service.name.toLowerCase().includes("dry")),
      Specialty: items.filter((service) => {
        const value = service.name.toLowerCase();
        return value.includes("shoe") || value.includes("bag") || value.includes("special");
      }),
    };
  }, [data?.data]);

  const active = groups[filter as keyof typeof groups] ?? groups.All;

  return (
    <AppLayout>
      <SEO
        title="Services | Fab Clean"
        description="Explore Fab Clean services across premium laundry, dry cleaning, specialty shoe care, and bag care."
        canonical="https://myfabclean.com/services"
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading title="Service architecture that feels premium before the booking even starts." subtitle="Services" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            Every category is clearer, less repetitive, and easier to scan. Customers can move from service discovery to pickup without hitting a dead end.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {Object.keys(groups).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full border px-5 py-2 text-sm transition-colors ${filter === item ? "border-primary/20 bg-primary/10 text-primary" : "border-line bg-panel/70 text-ink"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="container-wide pb-20">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {active.map((service, index) => {
                const Icon = iconMap[(service.icon?.toLowerCase() as keyof typeof iconMap) || "shirt"] || Shirt;

                return (
                  <FadeIn key={service.id} delay={index * 0.04}>
                    <Card className="lux-card h-full p-6">
                      <Badge variant="outline">From ₹{service.startingPrice}</Badge>
                      <div className="mt-6">
                        <StoryCard
                          icon={Icon}
                          title={service.name}
                          description={service.shortDescription || service.description}
                          className="border-none bg-transparent p-0 shadow-none"
                        />
                      </div>
                      <div className="mt-6">
                        <Link href="/schedule-pickup">
                          <Button variant="outline">Book this service</Button>
                        </Link>
                      </div>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </section>

        <section className="container-wide pb-24">
          <SupportBand title="Need help choosing the right service?" description="If the garment is delicate, premium, or unusual, message the team and let them guide the booking." />
        </section>
      </div>
    </AppLayout>
  );
}
