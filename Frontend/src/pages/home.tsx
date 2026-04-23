import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { useListPricing } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, SectionHeading } from "@/components/ui";
import {
  HighlightBadgeRow,
  PricingTable,
  ProcessRail,
  QuoteCard,
  StatStrip,
  StoryCard,
  SupportBand,
} from "@/components/site";
import {
  BRAND,
  BRANCHES,
  OPERATING_PILLARS,
  PROCESS_STEPS,
  SERVICE_HIGHLIGHTS,
  TRUST_STATS,
} from "@/lib/brand";
import { fetchHomepageReviews, type HomepageReview } from "@/lib/public-api";
import { formatCurrency } from "@/lib/utils";

type PricingCategory = {
  category: string;
  items: Array<{ item: string; price: number; unit?: string | null }>;
};

function PricingPreview() {
  const { data, isLoading } = useListPricing();
  const categories = (data?.data ?? []) as PricingCategory[];

  const preview = useMemo(() => {
    const groups: Record<string, PricingCategory[]> = {
      Laundry: [],
      "Dry Cleaning": [],
      Specialty: [],
    };

    for (const category of categories) {
      const name = category.category.toLowerCase();
      if (name.includes("shoe") || name.includes("bag") || name.includes("special")) groups.Specialty.push(category);
      else if (name.includes("dry")) groups["Dry Cleaning"].push(category);
      else groups.Laundry.push(category);
    }

    return Object.entries(groups).map(([title, list]) => ({
      title,
      items: list.flatMap((entry) => entry.items).slice(0, 4).map((item) => ({
        name: item.item,
        meta: item.unit ? `Per ${item.unit}` : null,
        price: formatCurrency(item.price),
      })),
    }));
  }, [categories]);

  if (isLoading) {
    return (
      <div className="grid gap-5 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index} className="lux-card h-72 animate-pulse bg-panel/70" />
        ))}
      </div>
    );
  }

  return <PricingTable sections={preview.filter((section) => section.items.length > 0)} />;
}

export default function Home() {
  const [reviews, setReviews] = useState<HomepageReview[]>([]);
  const { scrollYProgress } = useScroll();
  const visualY = useTransform(scrollYProgress, [0, 0.2], [0, 28]);

  useEffect(() => {
    void fetchHomepageReviews()
      .then((result) => {
        const merged = [
          ...(result.data.topReviews || []),
          ...(result.data.bestReviews || []),
          ...(result.data.latestReviews || []),
        ];

        const seen = new Set<string>();
        setReviews(
          merged.filter((review) => {
            if (seen.has(review.id)) return false;
            seen.add(review.id);
            return true;
          }).slice(0, 3),
        );
      })
      .catch(() => setReviews([]));
  }, []);

  return (
    <AppLayout>
      <SEO
        title="Fab Clean | Premium Garment Care in Pollachi"
        description="Premium laundry and dry cleaning with free pickup, clear pricing, and polished garment care across Pollachi and Kinathukadavu."
        canonical="https://myfabclean.com/"
      />

      <div className="page-shell">
        <section className="container-wide section-padding pb-8">
          <div className="hero-grid">
            <FadeIn className="max-w-3xl">
              <Badge>Pollachi and Kinathukadavu</Badge>
              <h1 className="mt-6 font-display text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
                {BRAND.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                {BRAND.heroLead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/schedule-pickup" data-cursor-label="Book">
                  <Button size="lg">
                    Book pickup
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/track-order" data-cursor-label="Track">
                  <Button size="lg" variant="outline">Track order</Button>
                </Link>
              </div>
              <div className="mt-8">
                <HighlightBadgeRow />
              </div>
            </FadeIn>

            <motion.div style={{ y: visualY }}>
              <div className="hero-visual">
                <div className="hero-float-card">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-primary-light">Fab Clean standard</p>
                  <p className="mt-3 font-display text-3xl">A cleaner digital experience for a premium local service.</p>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    Free pickup, transparent communication, and finishing that looks intentional.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container-wide pb-12">
          <StatStrip stats={TRUST_STATS} />
        </section>

        <section className="container-wide section-padding pt-10">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <FadeIn>
              <div className="visual-card min-h-[520px]">
                <img src={`${import.meta.env.BASE_URL}images/editorial-garment.svg`} alt="Fab Clean garment care illustration" loading="lazy" />
              </div>
            </FadeIn>
            <div>
              <SectionHeading
                align="left"
                subtitle="Service chapters"
                title="Luxury in feel. Practical in how fast a customer can act."
              />
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
                The new site treats service clarity as part of the premium experience. Customers should understand what you clean, how pickup works, and what the next step is without hunting through decorative noise.
              </p>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {SERVICE_HIGHLIGHTS.map((item, index) => (
                  <FadeIn key={item.title} delay={index * 0.05}>
                    <StoryCard {...item} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container-wide section-padding pt-4">
          <SectionHeading title="A shorter path from first visit to booked pickup." subtitle="How it works" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            Motion supports the story, but the structure does the real work: fewer decisions, faster trust, cleaner calls to action.
          </p>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <ProcessRail steps={PROCESS_STEPS} />
            <FadeIn>
              <div className="visual-card min-h-[420px]">
                <img src={`${import.meta.env.BASE_URL}images/editorial-process.svg`} alt="Fab Clean service process illustration" loading="lazy" />
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="container-wide section-padding pt-6">
          <SectionHeading title="Pricing that feels clear before the order even starts." subtitle="Preview rates" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            These preview categories are enough to orient a customer quickly. Full pricing remains available when they want detail.
          </p>
          <div className="mt-12">
            <PricingPreview />
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/pricing">
              <Button variant="outline">View full pricing</Button>
            </Link>
          </div>
        </section>

        <section className="container-wide section-padding pt-6">
          <SectionHeading title="Trust is earned in the details customers actually notice." subtitle="Why customers stay" />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {OPERATING_PILLARS.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <StoryCard {...item} />
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="container-wide section-padding pt-4">
          <SectionHeading title="Customer sentiment, framed with more confidence." subtitle="Reviews" />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {reviews.length ? (
              reviews.map((review, index) => (
                <FadeIn key={review.id} delay={index * 0.05}>
                  <QuoteCard
                    quote={review.feedback || "Great service from Fab Clean."}
                    name={review.customer_name || "Fab Clean Customer"}
                    meta={`${review.rating || 5} star service`}
                  />
                </FadeIn>
              ))
            ) : (
              <FadeIn>
                <Card className="lux-card p-6 lg:col-span-3">
                  <p className="font-display text-3xl text-ink">Fresh reviews will appear here once approved.</p>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                    The redesigned wall is ready for live customer feedback without looking empty or unfinished in the meantime.
                  </p>
                </Card>
              </FadeIn>
            )}
          </div>
        </section>

        <section className="container-wide section-padding pt-4">
          <SectionHeading title="Branch information should feel grounded, not buried." subtitle="Coverage" />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {BRANCHES.map((branch, index) => (
              <FadeIn key={branch.slug} delay={index * 0.05}>
                <Card className="lux-card p-7">
                  <Badge variant="outline">{branch.title}</Badge>
                  <h3 className="mt-6 font-display text-3xl text-ink">{branch.title}</h3>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">{branch.address}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={branch.mapHref} target="_blank" rel="noreferrer">
                      <Button variant="outline">
                        <MapPin className="h-4 w-4" />
                        Directions
                      </Button>
                    </a>
                    <a href={BRAND.phoneHref}>
                      <Button variant="secondary">{branch.phone}</Button>
                    </a>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="container-wide pb-24">
          <SupportBand />
        </section>
      </div>
    </AppLayout>
  );
}
