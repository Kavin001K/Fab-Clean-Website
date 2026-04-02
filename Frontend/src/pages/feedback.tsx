import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useRoute } from "wouter";
import { CheckCircle2, MessageSquareText, Search, Star } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, Input, SectionHeading } from "@/components/ui";
import {
  lookupFeedbackOrder,
  submitPublicFeedback,
  type FeedbackLookupResponse,
  type FeedbackSubmitResponse,
} from "@/lib/public-api";
import { useToast } from "@/hooks/use-toast";

function RatingSelector({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
            star <= value ? "border-amber-200 bg-amber-50 text-amber-500" : "border-border bg-white text-slate-300 hover:border-primary/25 hover:text-primary"
          }`}
        >
          <Star className={`h-5 w-5 ${star <= value ? "fill-current" : ""}`} />
        </button>
      ))}
    </div>
  );
}

function formatReviewTimestamp(value?: string | null): string {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function FeedbackPage() {
  const [, setLocation] = useLocation();
  const [matchesIdentifierRoute, routeParams] = useRoute("/feedback/:identifier");
  const [identifier, setIdentifier] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [orderData, setOrderData] = useState<FeedbackLookupResponse | null>(null);
  const [submitted, setSubmitted] = useState<FeedbackSubmitResponse | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const routeIdentifier = matchesIdentifierRoute ? decodeURIComponent(routeParams.identifier || "") : "";
  const resolvedIdentifier = orderData?.orderNumber || identifier.trim();

  const sentimentTone = useMemo(() => {
    if (!submitted) return "";
    return submitted.insight.sentiment === "positive"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : submitted.insight.sentiment === "negative"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-slate-100 text-slate-700";
  }, [submitted]);

  async function loadOrder(rawIdentifier: string, options?: { syncUrl?: boolean; showErrors?: boolean }) {
    const cleanIdentifier = rawIdentifier.trim();
    if (!cleanIdentifier) return;

    setIsLookingUp(true);
    setSubmitted(null);
    try {
      const result = await lookupFeedbackOrder(cleanIdentifier);
      setOrderData(result.data);
      setIdentifier(result.data.orderNumber);
      if (result.data.existingReview) {
        setRating(result.data.existingReview.rating);
        setFeedback(result.data.existingReview.feedback || "");
      }

      if (options?.syncUrl !== false) {
        const nextPath = `/feedback/${encodeURIComponent(result.data.orderNumber || cleanIdentifier)}`;
        if (window.location.pathname !== nextPath) setLocation(nextPath);
      }
    } catch (error) {
      if (options?.showErrors !== false) {
        toast({
          title: "Unable to load order",
          description: error instanceof Error ? error.message : "Please verify the order ID.",
          variant: "destructive",
        });
      }
      setOrderData(null);
    } finally {
      setIsLookingUp(false);
    }
  }

  async function handleLookup(event: React.FormEvent) {
    event.preventDefault();
    if (!identifier.trim()) {
      toast({ title: "Enter an order ID", description: "Load your order first.", variant: "destructive" });
      return;
    }
    await loadOrder(identifier, { syncUrl: true, showErrors: true });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialIdentifier = routeIdentifier || params.get("orderId") || "";
    const normalizedIdentifier = initialIdentifier.trim();
    if (!normalizedIdentifier) return;
    setIdentifier(normalizedIdentifier);
    void loadOrder(normalizedIdentifier, { syncUrl: true, showErrors: true });
  }, [routeIdentifier]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!resolvedIdentifier) {
      toast({ title: "Order required", description: "Load your order before submitting feedback.", variant: "destructive" });
      return;
    }
    if (!feedback.trim()) {
      toast({ title: "Review required", description: "Write a short review before submitting.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitPublicFeedback({
        identifier: resolvedIdentifier,
        rating,
        feedback: feedback.trim(),
      });
      setSubmitted(result.data);
      toast({ title: "Feedback submitted", description: "Thanks. Your review has been recorded." });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Unable to submit feedback right now.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppLayout>
      <SEO
        title="Feedback | Fab Clean"
        description="Load your order and leave service feedback for your Fab Clean order."
        canonical={`https://myfabclean.com${routeIdentifier ? `/feedback/${encodeURIComponent(routeIdentifier)}` : "/feedback"}`}
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading title="Share your experience" subtitle="Service Feedback" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            We value your feedback. Please load your order to share your experience with our garment care services.
          </p>
        </section>

        <section className="container-wide pb-20">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <FadeIn>
              <Card className="p-6 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Step 1</p>
                <h2 className="mt-4 text-3xl font-black">Load your order</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Enter your order number from your receipt to get started.
                </p>

                <form onSubmit={handleLookup} className="mt-6 space-y-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                      placeholder="Enter order ID or order number"
                      className="pl-11"
                    />
                  </div>
                  <Button type="submit" isLoading={isLookingUp}>
                    Load order
                  </Button>
                </form>

                {orderData ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[1.5rem] border border-border bg-muted/60 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Order loaded</p>
                    <h3 className="mt-3 break-all text-2xl font-black">{orderData.orderNumber}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{orderData.customerName || "Fab Clean Customer"}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Badge>{orderData.status.replace(/_/g, " ")}</Badge>
                      {orderData.existingReview ? <Badge variant="accent">Existing feedback found</Badge> : null}
                    </div>
                    {orderData.existingReview ? (
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        Saved on {formatReviewTimestamp(orderData.existingReview.created_at)}
                      </p>
                    ) : null}
                  </motion.div>
                ) : null}
              </Card>
            </FadeIn>

            <FadeIn delay={0.06}>
              <Card className="p-6 sm:p-8">
                <form onSubmit={handleSubmit}>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Step 2</p>
                  <h2 className="mt-4 text-3xl font-black">Rate the service and write the review</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">Your feedback helps us maintain the highest standards of care for your garments.</p>

                  <div className="mt-8 space-y-6">
                    <div>
                      <label className="mb-3 block text-sm font-bold text-foreground">Star rating</label>
                      <RatingSelector value={rating} onChange={setRating} />
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-bold text-foreground">Review</label>
                      <div className="relative">
                        <MessageSquareText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                        <textarea
                          value={feedback}
                          onChange={(event) => setFeedback(event.target.value)}
                          placeholder="Tell us what went well or what needs to improve."
                          className="min-h-[220px] w-full rounded-[1.4rem] border border-border bg-white px-11 py-4 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/12"
                        />
                      </div>
                    </div>

                    <Button type="submit" size="lg" isLoading={isSubmitting} disabled={!orderData || !feedback.trim()}>
                      Submit feedback
                    </Button>
                  </div>
                </form>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div key={submitted.reviewId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-8 rounded-[1.5rem] border border-border bg-muted/60 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <p className="text-lg font-black text-foreground">Feedback saved</p>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-muted-foreground">{submitted.insight.summary}</p>
                          <p className="mt-3 text-sm text-muted-foreground">
                            {submitted.customerName || orderData?.customerName || "Fab Clean Customer"} • {formatReviewTimestamp(submitted.reviewCreatedAt)}
                          </p>
                        </div>
                        <Badge className={sentimentTone}>{submitted.insight.sentiment}</Badge>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.2rem] border border-border bg-white px-4 py-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Category</p>
                          <p className="mt-2 text-base font-black text-foreground">{submitted.insight.category}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-border bg-white px-4 py-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">AI score</p>
                          <p className="mt-2 text-base font-black text-foreground">{Math.round(submitted.insight.score * 100)} / 100</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : orderData?.existingReview ? (
                    <motion.div key="existing-review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-8 rounded-[1.5rem] border border-border bg-muted/60 p-5">
                      <p className="text-lg font-black text-foreground">Existing review on this order</p>
                      <div className="mt-3 flex items-center gap-1 text-amber-500">
                        {Array.from({ length: orderData.existingReview.rating }, (_, starIndex) => (
                          <Star key={starIndex} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="mt-4 text-sm leading-7 text-foreground">{orderData.existingReview.feedback || "No review text saved."}</p>
                      <p className="mt-3 text-sm text-muted-foreground">{formatReviewTimestamp(orderData.existingReview.created_at)}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Card>
            </FadeIn>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
