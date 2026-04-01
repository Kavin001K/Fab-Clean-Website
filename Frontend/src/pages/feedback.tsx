import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useRoute } from "wouter";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, Input, SectionHeading } from "@/components/ui";
import { lookupFeedbackOrder, submitPublicFeedback, type FeedbackLookupResponse, type FeedbackSubmitResponse } from "@/lib/public-api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, MessageSquareText, Search, Sparkles, Star } from "lucide-react";

function RatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`flex h-14 w-14 items-center justify-center rounded-[1.4rem] border transition-all ${
            star <= value
              ? "border-[#F4B942]/40 bg-[#F4B942]/15 text-[#F4B942] shadow-lg shadow-[#F4B942]/10"
              : "border-white/10 bg-white/5 text-white/35 hover:border-white/20 hover:text-white/60"
          }`}
        >
          <Star className={`h-6 w-6 ${star <= value ? "fill-current" : ""}`} />
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
    if (!submitted) return "";
    return submitted.insight.sentiment === "positive"
      ? "bg-emerald-500/15 text-emerald-200 border border-emerald-300/20"
      : submitted.insight.sentiment === "negative"
        ? "bg-rose-500/15 text-rose-200 border border-rose-300/20"
        : "bg-slate-500/15 text-slate-200 border border-slate-300/20";
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
        if (window.location.pathname !== nextPath) {
          setLocation(nextPath);
        }
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
      toast({ title: "Order ID required", description: "Enter the order ID or order number first.", variant: "destructive" });
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
      toast({
        title: "Order required",
        description: "Load your order before submitting feedback.",
        variant: "destructive",
      });
      return;
    }

    if (!feedback.trim()) {
      toast({
        title: "Review required",
        description: "Write a short review before submitting feedback.",
        variant: "destructive",
      });
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
        title="Share Feedback | Fab Clean"
        description="Submit service feedback for your Fab Clean order using the order ID."
        canonical={`https://myfabclean.com${routeIdentifier ? `/feedback/${encodeURIComponent(routeIdentifier)}` : "/feedback"}`}
      />
      <div className="relative overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,185,66,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(10,132,255,0.14),transparent_34%)]" />
        <div className="container-wide relative z-10">
          <SectionHeading
            title="Voice Of The Garment Floor."
            subtitle="Feedback Intelligence Console"
            className="mb-14"
          />

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <FadeIn>
              <Card className="border-white/10 bg-[#08152e]/85 p-8 text-white">
                <div className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.32em] text-white/55">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Find your order first
                </div>
                <form onSubmit={handleLookup} className="space-y-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                    <Input
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                      placeholder="Enter order ID or order number"
                      className="h-16 rounded-[1.8rem] border-white/10 bg-white/5 pl-14 text-white placeholder:text-white/35"
                    />
                  </div>
                  <Button type="submit" isLoading={isLookingUp} className="h-16 w-full rounded-[1.8rem]">
                    Load Order
                  </Button>
                </form>

                <AnimatePresence mode="wait">
                  {orderData ? (
                    <motion.div
                      key={orderData.orderId}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">Order Matched</p>
                      <h3 className="mt-3 text-2xl font-black text-white">{orderData.orderNumber}</h3>
                      <p className="mt-2 text-white/55">{orderData.customerName || "Fab Clean Customer"}</p>
                      <div className="mt-5 flex items-center gap-3">
                        <Badge className="border-white/10 bg-white/10 text-white">{orderData.status.replace(/_/g, " ")}</Badge>
                        {orderData.existingReview ? (
                          <Badge className="border-primary/20 bg-primary/15 text-primary">Existing feedback found</Badge>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card className="border-white/10 bg-[#071126]/90 p-8 text-white">
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">Tell us how we performed</p>
                    <h2 className="mt-3 text-3xl font-black text-white">Operational Feedback That Drives Better Service.</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-white/60">Rating</label>
                      <RatingSelector value={rating} onChange={setRating} />
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-white/60">Review</label>
                      <div className="relative">
                        <MessageSquareText className="pointer-events-none absolute left-5 top-5 h-5 w-5 text-white/25" />
                        <textarea
                          value={feedback}
                          onChange={(event) => setFeedback(event.target.value)}
                          placeholder="Tell us about quality, delivery speed, garment handling, staff, or anything we should improve."
                          className="min-h-[220px] w-full rounded-[2rem] border border-white/10 bg-white/5 px-14 py-5 text-base text-white placeholder:text-white/30 outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={!orderData || !feedback.trim()}
                      className="h-16 w-full rounded-[1.8rem] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </form>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key={submitted.reviewId}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <p className="text-lg font-black text-white">Feedback captured</p>
                          </div>
                          <p className="mt-3 text-white/55">{submitted.insight.summary}</p>
                        </div>
                        <Badge className={sentimentTone}>{submitted.insight.sentiment}</Badge>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.4rem] border border-white/10 bg-[#0d1c3a] px-5 py-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-white/45">Category</p>
                          <p className="mt-2 text-lg font-bold text-white">{submitted.insight.category}</p>
                        </div>
                        <div className="rounded-[1.4rem] border border-white/10 bg-[#0d1c3a] px-5 py-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-white/45">AI Score</p>
                          <p className="mt-2 text-lg font-bold text-white">{Math.round(submitted.insight.score * 100)} / 100</p>
                        </div>
                      </div>

                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
