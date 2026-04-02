import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Card, FadeIn, SectionHeading, Badge } from "@/components/ui";
import { fetchHomepageReviews, type HomepageReview } from "@/lib/public-api";
import { Star } from "lucide-react";

function formatReviewTimestamp(value?: string | null): string {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function ReviewGrid({
  title,
  subtitle,
  reviews,
}: {
  title: string;
  subtitle: string;
  reviews: HomepageReview[];
}) {
  if (!reviews.length) {
    return (
      <section className="space-y-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">{subtitle}</p>
          <h2 className="mt-2 text-3xl font-black text-white">{title}</h2>
        </div>
        <Card className="border-white/10 bg-[#08152e]/85 p-8 text-white">
          <p className="text-lg font-bold">Fresh reviews will appear here soon.</p>
          <p className="mt-2 max-w-2xl text-white/55">
            This section reads directly from the live Supabase review views, so it updates automatically when new feedback is approved.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">{subtitle}</p>
          <h2 className="mt-2 text-3xl font-black text-white">{title}</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review, index) => (
          <FadeIn key={review.id} delay={index * 0.05}>
            <Card className="border-white/10 bg-[#08152e]/85 p-8 text-white">
              <div className="mb-6 flex items-center gap-1">
                {Array.from({ length: Number(review.rating || 5) }, (_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-[#F4B942] text-[#F4B942]" />
                ))}
              </div>
              <p className="text-lg font-medium leading-8 text-white/88">"{review.feedback || "Exceptional Fab Clean service."}"</p>
              <div className="mt-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-black text-white">{review.customer_name || "Fab Clean Customer"}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/45">{formatReviewTimestamp(review.created_at)}</p>
                </div>
                <Badge className="border-white/10 bg-white/10 text-white">{review.ai_category || "overall"}</Badge>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
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
    void fetchHomepageReviews().then((result) => setSections(result.data)).catch(() => {
      setSections({ topReviews: [], bestReviews: [], latestReviews: [] });
    });
  }, []);

  return (
    <AppLayout>
      <SEO
        title="Customer Reviews | Fab Clean"
        description="Browse AI-ranked Fab Clean customer reviews with ratings, review text, and timestamps."
        canonical="https://myfabclean.com/reviews"
      />
      <div className="relative overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(10,132,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(244,185,66,0.12),transparent_25%)]" />
        <div className="container-wide relative z-10 space-y-14">
          <SectionHeading title="Proof In Every Press." subtitle="Customer Reviews" className="mb-6" />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Top Reviews", value: sections.topReviews.length },
              { label: "Best Reviews", value: sections.bestReviews.length },
              { label: "Latest Reviews", value: sections.latestReviews.length },
            ].map((item) => (
              <Card key={item.label} className="border-white/10 bg-[#08152e]/85 p-5 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                <p className="mt-3 text-3xl font-black">{item.value}</p>
              </Card>
            ))}
          </div>
          <ReviewGrid title="Top Reviews" subtitle="AI Ranked" reviews={sections.topReviews} />
          <ReviewGrid title="Best Reviews" subtitle="Featured Excellence" reviews={sections.bestReviews} />
          <ReviewGrid title="Latest Reviews" subtitle="Most Recent Feedback" reviews={sections.latestReviews} />
        </div>
      </div>
    </AppLayout>
  );
}
