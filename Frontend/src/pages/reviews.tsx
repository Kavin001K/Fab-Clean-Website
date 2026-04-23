import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Card, FadeIn, SectionHeading } from "@/components/ui";
import { QuoteCard, StatStrip, SupportBand } from "@/components/site";
import { fetchHomepageReviews, type HomepageReview } from "@/lib/public-api";

export default function ReviewsPage() {
  const [groups, setGroups] = useState<{ topReviews: HomepageReview[]; bestReviews: HomepageReview[]; latestReviews: HomepageReview[] }>({
    topReviews: [],
    bestReviews: [],
    latestReviews: [],
  });

  useEffect(() => {
    void fetchHomepageReviews()
      .then((result) => setGroups(result.data))
      .catch(() => setGroups({ topReviews: [], bestReviews: [], latestReviews: [] }));
  }, []);

  const sections = [
    { title: "Top reviews", items: groups.topReviews },
    { title: "Best reviews", items: groups.bestReviews },
    { title: "Latest reviews", items: groups.latestReviews },
  ];

  return (
    <AppLayout>
      <SEO
        title="Reviews | Fab Clean"
        description="Read curated customer feedback for Fab Clean in a cleaner editorial layout."
        canonical="https://myfabclean.com/reviews"
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading title="Social proof should feel curated, not mechanically dumped onto a page." subtitle="Customer reviews" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            The redesigned review experience gives approved feedback more presence while preserving the underlying data categories already available from the API.
          </p>
          <div className="mt-12">
            <StatStrip
              stats={[
                { value: String(groups.topReviews.length), label: "Top reviews" },
                { value: String(groups.bestReviews.length), label: "Best reviews" },
                { value: String(groups.latestReviews.length), label: "Latest reviews" },
                { value: "5 star", label: "Premium framing" },
              ]}
            />
          </div>
        </section>

        <section className="container-wide pb-20 space-y-14">
          {sections.map((section) => (
            <div key={section.title}>
              <SectionHeading align="left" title={section.title} subtitle="Approved feedback" />
              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {section.items.length ? (
                  section.items.map((item, index) => (
                    <FadeIn key={item.id} delay={index * 0.04}>
                      <QuoteCard
                        quote={item.feedback || "Great service from Fab Clean."}
                        name={item.customer_name || "Fab Clean Customer"}
                        meta={`${item.rating || 5} star service`}
                      />
                    </FadeIn>
                  ))
                ) : (
                  <FadeIn>
                    <Card className="lux-card p-6 lg:col-span-3">
                      <p className="font-display text-3xl text-ink">This review lane is ready for live feedback.</p>
                      <p className="mt-4 text-base leading-8 text-muted-foreground">
                        Approved reviews will render here automatically without breaking the layout or leaving the page visually empty.
                      </p>
                    </Card>
                  </FadeIn>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="container-wide pb-24">
          <SupportBand title="Want to leave feedback on a recent order?" description="Track the order first, then open the feedback flow with the right identifier already in place." />
        </section>
      </div>
    </AppLayout>
  );
}
