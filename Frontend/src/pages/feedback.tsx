import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, SectionHeading } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import {
  apiFetch,
  GOOGLE_REVIEW_URL,
  type FeedbackContext,
} from "@/lib/customer-experience";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Loader2, MessageCircleHeart, Star } from "lucide-react";

type FeedbackContextResponse = {
  success: boolean;
  data: FeedbackContext;
};

type FeedbackSubmitResponse = {
  success: boolean;
  data: {
    orderId: string;
    orderNumber: string;
    rating: number;
    comment: string | null;
    feedbackSubmittedAt: string;
    googleReviewEligible: boolean;
  };
};

export default function FeedbackPage() {
  const orderNumber = useMemo(
    () => new URLSearchParams(window.location.search).get("orderNumber") || "",
    []
  );
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [submission, setSubmission] = useState<FeedbackSubmitResponse["data"] | null>(null);

  const feedbackQuery = useQuery({
    queryKey: ["feedback-context", orderNumber],
    queryFn: () =>
      apiFetch<FeedbackContextResponse>(`/api/feedback/context?orderNumber=${encodeURIComponent(orderNumber)}`).then(
        (response) => response.data
      ),
    enabled: Boolean(orderNumber),
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const metadata = {
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        clientTimestamp: new Date().toISOString(),
      };

      return apiFetch<FeedbackSubmitResponse>(
        "/api/feedback",
        {
          method: "POST",
          body: JSON.stringify({
            orderNumber,
            rating,
            comment,
            metadata,
          }),
        }
      );
    },
    onSuccess: (result) => {
      setSubmission(result.data);
      setShowGooglePrompt(result.data.googleReviewEligible);
    },
  });

  const context = feedbackQuery.data;

  return (
    <AppLayout>
      <SEO
        title="Share Feedback | Fab Clean"
        description="Tell Fab Clean how your order went and help us improve every pickup, clean, and delivery."
        canonical={`https://myfabclean.com/feedback${orderNumber ? `?orderNumber=${encodeURIComponent(orderNumber)}` : ""}`}
      />

      <section className="relative overflow-hidden pt-36 pb-28">
        <div className="absolute inset-0 bg-premium-mesh opacity-80" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/10 blur-[140px]" />
        </div>

        <div className="container-tight relative z-10 space-y-12">
          <FadeIn>
            <div className="text-center">
              <Badge className="mb-8 bg-white/80 text-primary border border-primary/15">
                Customer Feedback
              </Badge>
              <SectionHeading
                title="Tell Us How Your Fab Clean Experience Felt"
                subtitle="After-Service Review"
                className="mb-8"
              />
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Your feedback is stored directly against the ERP order so our team and website
                highlights always stay in sync.
              </p>
            </div>
          </FadeIn>

          {!orderNumber ? (
            <Card className="rounded-[3rem] bg-white/90 p-10 text-center">
              <h3 className="text-3xl font-black text-foreground">Missing order number</h3>
              <p className="mt-4 text-muted-foreground">
                Open the feedback link from WhatsApp or add <code>?orderNumber=...</code> to continue.
              </p>
            </Card>
          ) : null}

          {feedbackQuery.isLoading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading your order summary...</p>
              </div>
            </div>
          ) : null}

          {feedbackQuery.isError ? (
            <Card className="rounded-[3rem] bg-white/90 p-10 text-center">
              <h3 className="text-3xl font-black text-foreground">We couldn&apos;t load this order</h3>
              <p className="mt-4 text-muted-foreground">
                The feedback link may be incomplete or the order number may not exist in the ERP.
              </p>
            </Card>
          ) : null}

          {context ? (
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
              <Card className="rounded-[3rem] bg-white/92 p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-primary/12 text-primary border border-primary/15">
                    Order {context.orderNumber}
                  </Badge>
                  <Badge variant="outline" className="border-border bg-white">
                    {context.fulfillmentType}
                  </Badge>
                </div>

                <h3 className="mt-6 text-4xl font-black text-foreground">
                  How would you rate this order?
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Your rating helps us identify service wins and improve every garment journey.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <motion.button
                      key={value}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => setRating(value)}
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-[1.7rem] border transition-all",
                        value <= rating
                          ? "border-amber-200 bg-amber-50 text-amber-500 shadow-[0_18px_40px_-30px_rgba(244,185,66,0.8)]"
                          : "border-border bg-white text-muted-foreground hover:border-primary/20 hover:text-primary"
                      )}
                    >
                      <Star className={cn("h-7 w-7", value <= rating ? "fill-current" : "")} />
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8">
                  <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.28em] text-primary/60">
                    Comment
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="What stood out about the pickup, cleaning quality, finishing, or delivery?"
                    className="min-h-[180px] rounded-[2rem] bg-white/85"
                  />
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="min-w-[220px]"
                    disabled={rating < 1}
                    isLoading={submitMutation.isPending}
                    onClick={() => submitMutation.mutate()}
                  >
                    Submit Feedback
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Link href={`/trackorder/${encodeURIComponent(context.orderNumber)}`}>
                    <Button variant="outline" size="lg" className="min-w-[220px]">
                      Track Order
                    </Button>
                  </Link>
                </div>

                {context.existingFeedback.submittedAt && !submission ? (
                  <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                    Existing feedback found from{" "}
                    {new Date(context.existingFeedback.submittedAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    . Submitting again will update the same ERP order feedback record.
                  </div>
                ) : null}
              </Card>

              <div className="grid gap-8">
                <Card className="rounded-[3rem] bg-[#0B1C3B] p-8 text-white">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.7rem] bg-white/10">
                      <MessageCircleHeart className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.28em] text-white/45">
                        Order Snapshot
                      </div>
                      <h4 className="mt-3 text-3xl font-black">{context.customerName || "Fab Clean Customer"}</h4>
                      <p className="mt-3 text-white/70">
                        {context.items.length} service line{context.items.length === 1 ? "" : "s"} •{" "}
                        {formatCurrency(context.totalAmount || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {context.items.map((item, index) => (
                      <div
                        key={`${item.serviceName}-${index}`}
                        className="flex items-center justify-between rounded-[1.7rem] border border-white/10 bg-white/7 px-4 py-4"
                      >
                        <div>
                          <div className="font-bold">{item.serviceName}</div>
                          <div className="text-sm text-white/60">Quantity {item.quantity}</div>
                        </div>
                        <div className="font-bold">{formatCurrency(item.price || 0)}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <AnimatePresence>
                  {submission ? (
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                    >
                      <Card className="rounded-[3rem] bg-white/92 p-8">
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.7rem] bg-emerald-100 text-emerald-600">
                            <CheckCircle2 className="h-8 w-8" />
                          </div>
                          <div>
                            <h4 className="text-3xl font-black text-foreground">Feedback received</h4>
                            <p className="mt-3 text-muted-foreground">
                              Your review is now attached to order {submission.orderNumber} inside FabZClean-T1.
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <AnimatePresence>
        {showGooglePrompt ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1C3B]/55 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-xl rounded-[3rem] bg-white p-8 md:p-10"
            >
              <Badge className="bg-accent/20 text-[#C45D0E] border border-[#F4B942]/20">
                Thank You
              </Badge>
              <h3 className="mt-6 text-4xl font-black text-foreground">
                We&apos;re so glad you loved the service.
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Could you take 10 seconds to share this on Google? It helps more local customers discover Fab Clean.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="sm:min-w-[230px]"
                  onClick={() => {
                    if (GOOGLE_REVIEW_URL) {
                      window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
                    }
                  }}
                  disabled={!GOOGLE_REVIEW_URL}
                >
                  Share on Google
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowGooglePrompt(false)}
                  className="sm:min-w-[190px]"
                >
                  Maybe Later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </AppLayout>
  );
}
