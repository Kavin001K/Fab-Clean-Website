import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Shirt,
  Sparkles,
  Star,
  Truck,
  WashingMachine,
} from "lucide-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, SectionHeading } from "@/components/ui";
import { fetchHomepageReviews, type HomepageReview } from "@/lib/public-api";

function formatReviewTimestamp(value?: string | null) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

const serviceHighlights = [
  {
    icon: Shirt,
    title: "Dry cleaning for special garments",
    text: "Sarees, suits, lehengas, coats, and fabrics that need careful handling.",
  },
  {
    icon: WashingMachine,
    title: "Everyday laundry and household linen",
    text: "Daily wear, bedsheets, towels, curtains, and regular wash-and-fold orders.",
  },
  {
    icon: Sparkles,
    title: "Shoe, bag, and premium fabric care",
    text: "Cleaning for items that need more than a standard wash cycle.",
  },
];

const whyChooseFabClean = [
  {
    icon: Truck,
    title: "Pickup and delivery updates",
    text: "Customers can book pickups, track orders, and receive clear status changes.",
  },
  {
    icon: Clock3,
    title: "Clear turnaround communication",
    text: "The website explains what is happening and what the next step is.",
  },
  {
    icon: CheckCircle2,
    title: "Careful handling with service feedback",
    text: "Every order can collect feedback, which helps us surface the best reviews and improve service.",
  },
];

export default function Home() {
  const [reviews, setReviews] = useState<HomepageReview[]>([]);

  useEffect(() => {
    void fetchHomepageReviews()
      .then((result) => {
        setReviews([
          ...(result.data.topReviews || []),
          ...(result.data.bestReviews || []),
          ...(result.data.latestReviews || []),
        ]);
      })
      .catch(() => setReviews([]));
  }, []);

  const visibleReviews = useMemo(() => {
    const seen = new Set<string>();
    return reviews.filter((review) => {
      if (seen.has(review.id)) return false;
      seen.add(review.id);
      return true;
    }).slice(0, 3);
  }, [reviews]);

  return (
    <AppLayout>
      <SEO
        title="Fab Clean | Laundry, Dry Cleaning, Pickup, Tracking, and Reviews"
        description="Book pickup, track orders, and get clear garment care support from Fab Clean. Dry cleaning, laundry, shoes, linen, and customer feedback all in one place."
        canonical="https://myfabclean.com/"
      />

      <div className="page-shell">
        <section className="container-wide section-padding relative">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <FadeIn className="space-y-6">
              <span className="eyebrow">Simple garment care, clearly explained</span>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-black sm:text-6xl lg:text-7xl">
                  Laundry and dry cleaning that feels <span className="text-gradient">easy to trust</span>.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  Book a pickup, track every order, and share feedback from one clean customer experience. Fab Clean is built for everyday use, not guesswork.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/schedule-pickup">
                  <Button size="lg">
                    Book pickup
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/track-order">
                  <Button variant="outline" size="lg">
                    Track an order
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="info-chip">Pickup support in Pollachi</span>
                <span className="info-chip">Live order tracking</span>
                <span className="info-chip">Feedback saved to real orders</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="hero-image-card relative">
                <picture>
                  <source srcSet={`${import.meta.env.BASE_URL}images/premium-hero.webp`} type="image/webp" />
                  <img
                    src={`${import.meta.env.BASE_URL}images/premium-hero.png`}
                    alt="Freshly cleaned garments prepared for delivery"
                    className="h-full min-h-[420px] w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-[#10244f]/48 via-transparent to-white/10" />
                <div className="absolute bottom-5 left-5 right-5 grid gap-4 sm:grid-cols-2">
                  <div className="surface-soft p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">What customers can do</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">Track orders, open feedback links, and view live review content without calling the store.</p>
                  </div>
                  <div className="surface-soft p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">What stores can do</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">Keep ERP data, website signups, order updates, and customer history aligned.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="container-wide section-padding">
          <SectionHeading title="How Fab Clean works" subtitle="Three simple steps" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Book pickup or walk in",
                text: "Choose the service, pickup time, and branch that works for you.",
              },
              {
                step: "02",
                title: "Track progress online",
                text: "Check your order status any time using the order number or link.",
              },
              {
                step: "03",
                title: "Review the service",
                text: "Your feedback is saved to the order and helps improve what we do next.",
              },
            ].map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.06}>
                <Card className="h-full p-6">
                  <Badge variant="accent">{item.step}</Badge>
                  <h3 className="mt-5 text-2xl font-black">{item.title}</h3>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">{item.text}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="container-wide section-padding">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <FadeIn className="space-y-5">
              <SectionHeading
                align="left"
                title="Services customers usually ask for first"
                subtitle="Popular care categories"
              />
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                The service list stays practical: everyday wear, delicate garments, and items that need specialist handling. Every card below explains what the service is for in simple language.
              </p>
              <Link href="/services">
                <Button variant="outline">
                  View all services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </FadeIn>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {serviceHighlights.map((item, index) => (
                <FadeIn key={item.title} delay={index * 0.05}>
                  <Card className="h-full p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-2xl font-black">{item.title}</h3>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">{item.text}</p>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="container-wide section-padding">
          <SectionHeading title="Why customers stay with Fab Clean" subtitle="Built for clarity" />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {whyChooseFabClean.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <Card className="h-full p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-black">{item.title}</h3>
                  </div>
                  <p className="mt-5 text-base leading-7 text-muted-foreground">{item.text}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="container-wide section-padding">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading align="left" title="What customers are saying now" subtitle="Live review preview" />
            <Link href="/reviews">
              <Button variant="outline">Open all reviews</Button>
            </Link>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {(visibleReviews.length ? visibleReviews : [
              { id: "fallback-1", customer_name: "Fab Clean Customer", rating: 5, feedback: "Fresh reviews will appear here once new feedback is approved.", created_at: new Date().toISOString() },
            ]).map((review, index) => (
              <FadeIn key={review.id} delay={index * 0.05}>
                <Card className="h-full p-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: Number(review.rating || 5) }, (_, starIndex) => (
                      <Star key={starIndex} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 text-lg leading-8 text-foreground">“{review.feedback || "Clean, clear, and reliable service."}”</p>
                  <div className="mt-6">
                    <p className="font-bold text-foreground">{review.customer_name || "Fab Clean Customer"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatReviewTimestamp(review.created_at)}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="container-wide section-padding">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <FadeIn>
              <Card className="h-full p-7 sm:p-8">
                <Badge>Service area</Badge>
                <h2 className="mt-5 text-4xl font-black sm:text-5xl">Pickup support across Pollachi and nearby areas</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  The website is designed to explain where service is available, how pickup works, and how customers can get support quickly without guessing what to do next.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      branch: "Pollachi branch",
                      address: "#16, Venkatramana Round Road, Mahalingapuram, Pollachi",
                    },
                    {
                      branch: "Kinathukadavu branch",
                      address: "#442/11, Krishnasamypuram, Kinathukadavu",
                    },
                  ].map((item) => (
                    <div key={item.branch} className="surface-soft p-5">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-black text-foreground">{item.branch}</p>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.06}>
              <Card className="h-full bg-brand-gradient p-7 text-white sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white/80">Need help right now?</p>
                <h2 className="mt-5 text-4xl font-black sm:text-5xl">Use the shortest path.</h2>
                <p className="mt-5 text-lg leading-8 text-white/80">
                  Book a pickup if you are ready to send garments. Use order tracking if you already have a receipt. Use feedback when the order is complete and you want the team to review your experience.
                </p>
                <div className="mt-8 grid gap-3">
                  <Link href="/schedule-pickup">
                    <Button variant="secondary" className="w-full justify-center">
                      Book pickup
                    </Button>
                  </Link>
                  <Link href="/track-order">
                    <Button variant="outline" className="w-full justify-center border-white/25 bg-white/10 text-white hover:bg-white/16">
                      Track an order
                    </Button>
                  </Link>
                </div>
              </Card>
            </FadeIn>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
