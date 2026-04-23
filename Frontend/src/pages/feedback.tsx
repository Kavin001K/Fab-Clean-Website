import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { CheckCircle2, MessageSquareText, Search, Star } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Input, SectionHeading, Textarea } from "@/components/ui";
import { FormPanel, SupportBand } from "@/components/site";
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
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${star <= value ? "border-primary/20 bg-primary/10 text-primary" : "border-line bg-background/70 text-muted-foreground"}`}
        >
          <Star className={`h-5 w-5 ${star <= value ? "fill-current" : ""}`} />
        </button>
      ))}
    </div>
  );
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
    if (!submitted) return "outline";
    return submitted.insight.sentiment === "positive" ? "accent" : "outline";
  }, [submitted]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialIdentifier = routeIdentifier || params.get("orderId") || "";
    if (!initialIdentifier.trim()) return;
    setIdentifier(initialIdentifier);
    void loadOrder(initialIdentifier, { syncUrl: true, showErrors: true });
  }, [routeIdentifier]);

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
        description="Load your order and leave service feedback in a cleaner, more confident review flow."
        canonical={`https://myfabclean.com${routeIdentifier ? `/feedback/${encodeURIComponent(routeIdentifier)}` : "/feedback"}`}
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading title="Feedback should feel more considered than a generic form." subtitle="Order feedback" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            The review flow now starts by loading the right order first, then gives the customer a simpler rating and text submission experience.
          </p>
        </section>

        <section className="container-wide pb-20">
          <FormPanel
            eyebrow="Feedback flow"
            title="Load the order, then leave a cleaner review."
            description="The order lookup stays separate from the review itself so the customer always knows which order the feedback is tied to."
            sideNote={
              orderData ? (
                <div className="rounded-[1.5rem] border border-line bg-background/70 p-5">
                  <p className="eyebrow">Order loaded</p>
                  <p className="mt-4 font-medium text-ink">{orderData.orderNumber}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{orderData.customerName || "Fab Clean Customer"}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge variant="outline">{orderData.status.replace(/_/g, " ")}</Badge>
                    {orderData.existingReview ? <Badge variant="accent">Existing review found</Badge> : null}
                  </div>
                </div>
              ) : undefined
            }
          >
            <div className="space-y-8">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!identifier.trim()) {
                    toast({ title: "Enter an order ID", description: "Load your order first.", variant: "destructive" });
                    return;
                  }
                  void loadOrder(identifier, { syncUrl: true, showErrors: true });
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="pl-11" placeholder="Enter order ID or order number" />
                </div>
                <Button type="submit" isLoading={isLookingUp}>Load order</Button>
              </form>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-3 block text-sm font-medium text-ink">Star rating</label>
                  <RatingSelector value={rating} onChange={setRating} />
                </div>
                <div className="relative">
                  <MessageSquareText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                  <Textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} className="pl-11" placeholder="Tell us what went well or what needs to improve." />
                </div>
                <Button type="submit" size="lg" isLoading={isSubmitting} disabled={!orderData || !feedback.trim()}>
                  Submit feedback
                </Button>
              </form>

              {submitted ? (
                <div className="rounded-[1.5rem] border border-line bg-background/70 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <p className="font-medium text-ink">Feedback saved</p>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{submitted.insight.summary}</p>
                    </div>
                    <Badge variant={sentimentTone as "outline" | "accent"}>{submitted.insight.sentiment}</Badge>
                  </div>
                </div>
              ) : null}
            </div>
          </FormPanel>
        </section>

        <section className="container-wide pb-24">
          <SupportBand title="Need to verify the order first?" description="Open the tracking page when the customer only has the receipt number and wants status before leaving a review." />
        </section>
      </div>
    </AppLayout>
  );
}
