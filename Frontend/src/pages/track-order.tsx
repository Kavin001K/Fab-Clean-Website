import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useRoute } from "wouter";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button, Card, FadeIn, Input, SectionHeading, Badge } from "@/components/ui";
import { trackOrderById, type PublicTrackedOrder } from "@/lib/public-api";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  FileText,
  Package2,
  Search,
  Sparkles,
  Truck,
} from "lucide-react";

const statusTone: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-200 border border-amber-300/20",
  processing: "bg-sky-500/15 text-sky-200 border border-sky-300/20",
  ready_for_pickup: "bg-emerald-500/15 text-emerald-200 border border-emerald-300/20",
  out_for_delivery: "bg-violet-500/15 text-violet-200 border border-violet-300/20",
  delivered: "bg-green-500/15 text-green-100 border border-green-300/20",
  completed: "bg-green-500/15 text-green-100 border border-green-300/20",
};

function StageRail({ order }: { order: PublicTrackedOrder }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4 bottom-4 w-px bg-white/10 md:left-0 md:right-0 md:top-5 md:h-px md:w-auto" />
      <div className="grid gap-6 md:grid-cols-5">
        {order.stages.map((stage, index) => (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="relative flex items-start gap-4 md:flex-col md:items-center md:text-center"
          >
            <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border ${
              stage.completed
                ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                : "border-white/15 bg-white/5 text-white/50"
            }`}>
              {stage.completed ? <BadgeCheck className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
            </div>
            <div>
              <p className={`text-sm font-black uppercase tracking-[0.16em] ${stage.completed ? "text-white" : "text-white/50"}`}>
                {stage.label}
              </p>
              <p className="mt-1 text-xs text-white/45">{stage.stage.replace(/_/g, " ")}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function TrackOrder() {
  const [, setLocation] = useLocation();
  const [matchesIdentifierRoute, routeParams] = useRoute("/track-order/:identifier");
  const [identifier, setIdentifier] = useState("");
  const [order, setOrder] = useState<PublicTrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastRequestedIdentifier = useRef<string | null>(null);
  const { toast } = useToast();

  const routeIdentifier = matchesIdentifierRoute ? decodeURIComponent(routeParams.identifier || "") : "";

  const statusClass = useMemo(
    () => (order ? statusTone[order.status] || "bg-white/10 text-white border border-white/10" : ""),
    [order],
  );

  async function lookupOrder(rawIdentifier: string, options?: { syncUrl?: boolean; showErrors?: boolean }) {
    const cleanIdentifier = rawIdentifier.trim();
    if (!cleanIdentifier) return;

    lastRequestedIdentifier.current = cleanIdentifier.toUpperCase();
    setIsLoading(true);
    try {
      const result = await trackOrderById(cleanIdentifier);
      setOrder(result.data);
      const canonicalIdentifier = result.data.reference || cleanIdentifier;
      setIdentifier(canonicalIdentifier);

      if (options?.syncUrl !== false) {
        const nextPath = `/track-order/${encodeURIComponent(canonicalIdentifier)}`;
        if (window.location.pathname !== nextPath) {
          setLocation(nextPath);
        }
      }
    } catch (error) {
      if (options?.showErrors !== false) {
        toast({
          title: "Order not found",
          description: error instanceof Error ? error.message : "Unable to locate that order.",
          variant: "destructive",
        });
      }
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTrack(event: React.FormEvent) {
    event.preventDefault();
    if (!identifier.trim()) {
      toast({ title: "Order ID required", description: "Enter the order ID or order number to continue.", variant: "destructive" });
      return;
    }

    await lookupOrder(identifier, { syncUrl: true, showErrors: true });
  }

  useEffect(() => {
    const legacyIdentifier = new URLSearchParams(window.location.search).get("orderId") || "";
    const initialIdentifier = routeIdentifier || legacyIdentifier;
    const normalizedIdentifier = initialIdentifier.trim();

    if (!normalizedIdentifier) return;

    setIdentifier(normalizedIdentifier);

    if (lastRequestedIdentifier.current === normalizedIdentifier.toUpperCase()) {
      return;
    }

    void lookupOrder(normalizedIdentifier, {
      syncUrl: true,
      showErrors: true,
    });
  }, [routeIdentifier]);

  return (
    <AppLayout>
      <SEO
        title="Track Your Order | Fab Clean"
        description="Track your Fab Clean order in real time using your order ID or order number."
        canonical={`https://myfabclean.com${routeIdentifier ? `/track-order/${encodeURIComponent(routeIdentifier)}` : "/track-order"}`}
      />
      <div className="relative overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(10,132,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(244,185,66,0.14),transparent_30%)]" />
          <div className="absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-white/5 blur-[180px]" />
        </div>

        <div className="container-wide relative z-10">
          <SectionHeading
            title="Track Every Move."
            subtitle="Live Order Command Center"
            className="mb-14"
          />

          <FadeIn>
            <Card className="border-white/10 bg-[#08152e]/80 p-8 text-white backdrop-blur-2xl md:p-10">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <div className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.32em] text-white/55">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Industrial-grade live visibility
                  </div>

                  <form onSubmit={handleTrack} className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                      <Input
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                        placeholder="Enter order ID or order number"
                        className="h-16 rounded-[1.8rem] border-white/10 bg-white/5 pl-14 text-white placeholder:text-white/35"
                      />
                    </div>
                    <Button type="submit" isLoading={isLoading} className="h-16 rounded-[1.8rem] px-10">
                      Track Now
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </form>

                  <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/45">
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Works with ERP order IDs</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Supports order numbers too</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Status updates in real time</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    { icon: Package2, title: "Pickup to delivery", body: "View the exact lifecycle step without calling the store." },
                    { icon: Truck, title: "Dispatch visibility", body: "Know when garments are ready, in transit, or delivered." },
                    { icon: FileText, title: "Invoice access", body: "Download linked invoices as soon as billing is generated." },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
                    >
                      <item.icon className="mb-3 h-5 w-5 text-primary" />
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-white">{item.title}</p>
                      <p className="mt-2 text-sm text-white/55">{item.body}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </FadeIn>

          <AnimatePresence mode="wait">
            {order ? (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="mt-10 space-y-8"
              >
                <Card className="border-white/10 bg-[#071126]/90 p-8 text-white md:p-10">
                  <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">Order Identifier</p>
                      <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">{order.reference}</h2>
                      <p className="mt-3 text-white/55">ERP Order ID: {order.orderId}</p>
                    </div>
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <Badge className={statusClass}>{order.status.replace(/_/g, " ")}</Badge>
                      <p className="flex items-center gap-2 text-sm text-white/55">
                        <Clock3 className="h-4 w-4" />
                        Last updated {new Date(order.updatedAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <StageRail order={order} />
                </Card>

                <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
                  <Card className="border-white/10 bg-[#08152e]/85 p-8 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">Order Snapshot</p>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/45">Customer</p>
                        <p className="mt-3 text-xl font-bold text-white">{order.customerName || "Fab Clean Customer"}</p>
                      </div>
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/45">Total</p>
                        <p className="mt-3 text-xl font-bold text-white">{formatCurrency(order.totalAmount || 0)}</p>
                      </div>
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/45">Payment</p>
                        <p className="mt-3 text-xl font-bold text-white">{order.paymentStatus || "pending"}</p>
                      </div>
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/45">Pickup Date</p>
                        <p className="mt-3 text-xl font-bold text-white">
                          {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString("en-IN") : "Awaiting schedule"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-white/10 bg-[#071126]/90 p-8 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">Services & Actions</p>
                    <div className="mt-6 space-y-4">
                      {(order.services.length ? order.services : ["Laundry service"]).map((service, index) => (
                        <motion.div
                          key={`${service}-${index}`}
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-4"
                        >
                          <p className="font-semibold text-white">{service}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                      {order.invoiceUrl ? (
                        <a href={order.invoiceUrl} target="_blank" rel="noreferrer">
                          <Button className="w-full h-14 rounded-[1.6rem]">Open Invoice</Button>
                        </a>
                      ) : null}
                      <Link href={`/feedback/${encodeURIComponent(order.reference || order.orderId)}`}>
                        <Button variant="outline" className="w-full h-14 rounded-[1.6rem] border-white/15 bg-white/5 text-white">
                          Leave Feedback
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
