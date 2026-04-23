import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useListPricing } from "@workspace/api-client-react";
import { ArrowRight, Loader2, Phone } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, SectionHeading } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

type PricingCategory = {
  category: string;
  items: Array<{ item: string; price: number; type?: string | null; unit?: string | null }>;
};

export default function Pricing() {
  const { data, isLoading } = useListPricing();
  const categories = (data?.data ?? []) as PricingCategory[];
  const grouped = useMemo(() => {
    const buckets: Record<string, PricingCategory[]> = {
      Laundry: [],
      "Dry Cleaning": [],
      "Shoes & Bags": [],
    };

    for (const category of categories) {
      const name = category.category.toLowerCase();
      if (name.includes("shoe") || name.includes("bag")) buckets["Shoes & Bags"].push(category);
      else if (name.includes("dry")) buckets["Dry Cleaning"].push(category);
      else buckets.Laundry.push(category);
    }

    return buckets;
  }, [categories]);

  const tabs = Object.keys(grouped);
  const [activeTab, setActiveTab] = useState(tabs[0] || "Laundry");
  const visible = grouped[activeTab] && grouped[activeTab].length ? grouped[activeTab] : categories;

  return (
    <AppLayout>
      <SEO
        title="Pricing | Fab Clean"
        description="See Fab Clean pricing in a cleaner format with category grouping, pickup notes, and simple booking actions."
        canonical="https://myfabclean.com/pricing"
      />

      <div className="page-shell">
        <section className="container-wide section-padding relative overflow-hidden bg-premium-mesh subtle-grid rounded-3xl">
          <SectionHeading title="Pricing that is easier to scan" subtitle="Clear rates" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            Prices are grouped so customers can scan the right category faster. Final billing still depends on the actual item count, condition, and service selected at the store.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  activeTab === tab ? "bg-primary text-white shadow-md scale-105" : "border border-border bg-white text-foreground hover:border-primary/35 hover:text-primary hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="container-wide pb-20">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {visible.map((category, categoryIndex) => (
                <FadeIn key={category.category} delay={categoryIndex * 0.04}>
                  <Card className="p-6 sm:p-7">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-3xl font-black sm:text-4xl">{category.category}</h2>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          Pick the item closest to your order. If you are unsure, the team will confirm the service at pickup or drop-off.
                        </p>
                      </div>
                      <Badge>Updated pricing view</Badge>
                    </div>

                    <div className="mt-6 grid gap-3">
                      {category.items.map((item) => (
                        <div key={`${category.category}-${item.item}`} className="grid gap-4 rounded-[1.25rem] border border-border bg-white px-4 py-4 md:grid-cols-[1.4fr_0.8fr_auto] md:items-center">
                          <div>
                            <p className="text-lg font-black text-foreground">{item.item}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{item.type || "Standard care"}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.unit ? `Charged per ${item.unit}` : "Fixed item price"}</p>
                          <p className="text-xl font-black text-primary">{formatCurrency(item.price)}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          )}
        </section>

        <section className="container-wide pb-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <FadeIn>
              <Card className="h-full p-7 sm:p-8">
                <Badge variant="accent">Good to know</Badge>
                <h2 className="mt-5 text-4xl font-black sm:text-5xl">What the price usually covers</h2>
                <div className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
                  <p>Inspection, suitable cleaning method, routine finishing, and normal handling are included in the listed service rate.</p>
                  <p>Pickup availability, urgency, stain condition, and garment construction can affect the final operational plan.</p>
                  <p>The website uses simple English here on purpose so customers know what to expect before they book.</p>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.06}>
              <Card className="h-full bg-brand-gradient p-7 text-white sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white/80">Next step</p>
                <h2 className="mt-5 text-4xl font-black sm:text-5xl">Need a quick answer before booking?</h2>
                <p className="mt-5 text-lg leading-8 text-white/80">
                  Call or message the team if the item is unusual, premium, or hard to classify from the rate card.
                </p>
                <div className="mt-8 grid gap-3">
                  <Link href="/schedule-pickup">
                    <Button variant="secondary" className="w-full">
                      Book pickup
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="tel:+919363059595">
                    <Button variant="outline" className="w-full border-white/25 bg-white/10 text-white hover:bg-white/16">
                      <Phone className="h-4 w-4" />
                      Call the team
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
