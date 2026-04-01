import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useListBestReviews } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, SectionHeading } from "@/components/ui";
import { formatReviewDate, type PublicReview } from "@/lib/customer-experience";
import { Star } from "lucide-react";

export default function TestimonialsPage() {
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<PublicReview[]>([]);

  const reviewsQuery = useListBestReviews(
    { page, pageSize: 12 },
    {
      query: {
        placeholderData: (previousData: any) => previousData,
      } as any,
    }
  );

  useEffect(() => {
    const pageReviews = reviewsQuery.data?.data;
    if (!pageReviews) return;

    setReviews((current) => {
      if (page === 1) {
        return pageReviews;
      }

      const existingIds = new Set(current.map((review) => review.id));
      return [...current, ...pageReviews.filter((review) => !existingIds.has(review.id))];
    });
  }, [page, reviewsQuery.data]);

  const hasMore = reviewsQuery.data?.meta?.hasMore || false;
  const isInitialLoading = reviewsQuery.isLoading && page === 1 && reviews.length === 0;
  const hasReviews = reviews.length > 0;

  return (
    <AppLayout>
      <SEO
        title="Customer Testimonials | Fab Clean"
        description="Read curated five-star experiences from Fab Clean customers across Pollachi and nearby areas."
        canonical="https://myfabclean.com/testimonials"
      />

      <section className="relative overflow-hidden pt-36 pb-28">
        <div className="absolute inset-0 bg-premium-mesh opacity-80" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-[-6rem] h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-0 left-[-5rem] h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <div className="container-wide relative z-10">
          <SectionHeading
            title="Stories from Our Prime Community"
            subtitle="Public Testimonials"
            className="mb-12"
          />
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            These reviews are curated from real ERP-linked customer feedback and updated for the
            website automatically.
          </p>

          {isInitialLoading ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="rounded-[3rem] bg-white/88 p-8">
                  <div className="h-56 animate-pulse rounded-[2rem] bg-muted/40" />
                </Card>
              ))}
            </div>
          ) : hasReviews ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review, index) => (
                <FadeIn key={review.id} delay={index * 0.04}>
                  <Card className="h-full rounded-[3rem] bg-white/90 p-8 md:p-9">
                    <div className="mb-8 flex items-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-5 w-5 ${
                            starIndex < review.rating
                              ? "fill-[#F4B942] text-[#F4B942]"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-2xl font-serif italic leading-[1.45] text-foreground">
                      "{review.comment || "Fab Clean delivered a great experience."}"
                    </p>
                    <div className="mt-10 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xl font-black text-foreground">{review.customerName}</div>
                        <div className="mt-1 text-[11px] font-black uppercase tracking-[0.26em] text-muted-foreground/50">
                          {review.location}
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border border-primary/15">
                        {formatReviewDate(review.createdAt)}
                      </Badge>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          ) : (
            <Card className="rounded-[3rem] bg-white/90 p-10 text-center">
              <h3 className="text-3xl font-black text-foreground">No curated reviews are live yet</h3>
              <p className="mt-4 text-muted-foreground">
                Positive ERP-linked feedback will start appearing here as soon as curation completes.
              </p>
            </Card>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 flex justify-center"
          >
            {hasMore ? (
              <Button
                size="lg"
                onClick={() => setPage((current) => current + 1)}
                isLoading={reviewsQuery.isFetching}
              >
                Load More Reviews
              </Button>
            ) : (
              <Badge className="bg-white/70 text-muted-foreground border border-border">
                You&apos;ve reached the current end of our best reviews.
              </Badge>
            )}
          </motion.div>
        </div>
      </section>
    </AppLayout>
  );
}
