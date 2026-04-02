import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Card, FadeIn, SectionHeading } from "@/components/ui";
import { fetchHomepageReviews, type HomepageReview } from "@/lib/public-api";

function formatReviewTimestamp(value?: string | null): string {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function ReviewSection({
  title,
  subtitle,
  reviews,
}: {
  title: string;
  subtitle: string;
  reviews: HomepageReview[];
}) {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{subtitle}</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h2>
        </div>
        <Badge>{reviews.length} reviews</Badge>
      </div>

      {reviews.length ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <FadeIn key={review.id} delay={index * 0.05}>
              <Card className="h-full p-6">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: Number(review.rating || 5) }, (_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-lg leading-8 text-foreground">“{review.feedback || "Great service from Fab Clean."}”</p>
                <div className="mt-6">
                  <p className="font-black text-foreground">{review.customer_name || "Fab Clean Customer"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatReviewTimestamp(review.created_at)}</p>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <p className="text-lg font-black">Fresh reviews will appear here soon.</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">This section reads from the live review views, so new approved feedback will show up automatically.</p>
        </Card>
      )}
    </section>
  );
}

export default function ReviewsPage() {
  const [sections, setSections] = useState<{ topReviews: HomepageReview[]; bestReviews: HomepageReview[]; latestReviews: HomepageReview[] }>({
    topReviews: [],
    bestReviews: [],
    latestReviews: [],
  });

  useEffect(() => {
    void fetchHomepageReviews()
      .then((result) => setSections(result.data))
      .catch(() => setSections({ topReviews: [], bestReviews: [], latestReviews: [] }));
  }, []);

  return (
    <AppLayout>
      <SEO
        title="Reviews | Fab Clean"
        description="Read top, best, and latest Fab Clean reviews with customer name, star rating, review text, and timestamp."
        canonical="https://myfabclean.com/reviews"
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading title="Real reviews from real orders" subtitle="Customer reviews" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            Reviews displayed here come from feedback saved against real orders. We show the customer name, rating, review text, and review time. Phone numbers stay private.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Top reviews", value: sections.topReviews.length },
              { label: "Best reviews", value: sections.bestReviews.length },
              { label: "Latest reviews", value: sections.latestReviews.length },
            ].map((item) => (
              <Card key={item.label} className="p-5 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{item.label}</p>
                <p className="mt-3 text-3xl font-black">{item.value}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container-wide space-y-16 pb-20">
          <ReviewSection title="Top reviews" subtitle="AI ranked" reviews={sections.topReviews} />
          <ReviewSection title="Best reviews" subtitle="Featured feedback" reviews={sections.bestReviews} />
          <ReviewSection title="Latest reviews" subtitle="Recent customer feedback" reviews={sections.latestReviews} />
        </section>
      </div>
    </AppLayout>
  );
}
