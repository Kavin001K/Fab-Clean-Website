import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowRight, Clock3, FileText, Package2, Search, Truck } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, Input, SectionHeading } from "@/components/ui";
import { trackOrderById, type PublicTrackedOrder } from "@/lib/public-api";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const statusTone: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  processing: "border-sky-200 bg-sky-50 text-sky-700",
  ready_for_pickup: "border-emerald-200 bg-emerald-50 text-emerald-700",
  out_for_delivery: "border-violet-200 bg-violet-50 text-violet-700",
  delivered: "border-green-200 bg-green-50 text-green-700",
  completed: "border-green-200 bg-green-50 text-green-700",
};

function StageRail({ order }: { order: PublicTrackedOrder }) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {order.stages.map((stage, index) => (
        <motion.div
          key={stage.stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`rounded-[1.4rem] border p-4 ${stage.completed ? "border-primary/20 bg-primary/10" : "border-border bg-white"}`}
        >
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${stage.completed ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
            <span className="text-sm font-bold">{index + 1}</span>
          </div>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-foreground">{stage.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stage.stage.replace(/_/g, " ")}</p>
        </motion.div>
      ))}
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
    () => (order ? statusTone[order.status] || "border-border bg-muted text-foreground" : ""),
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
        if (window.location.pathname !== nextPath) setLocation(nextPath);
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
      toast({ title: "Enter an order ID", description: "Use your receipt order number or the ERP order ID.", variant: "destructive" });
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
    if (lastRequestedIdentifier.current === normalizedIdentifier.toUpperCase()) return;
    void lookupOrder(normalizedIdentifier, { syncUrl: true, showErrors: true });
  }, [routeIdentifier]);

  return (
    <AppLayout>
      <SEO
        title="Track Order | Fab Clean"
        description="Track your Fab Clean order using the order ID or order number."
        canonical={`https://myfabclean.com${routeIdentifier ? `/track-order/${encodeURIComponent(routeIdentifier)}` : "/track-order"}`}
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading title="Track your order in one quick view" subtitle="Track order" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            Enter the order number from your receipt or open a direct tracking link. The status shown here is read from the same operational order record used by the store.
          </p>

          <FadeIn className="mx-auto mt-10 max-w-5xl">
            <Card className="p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <form onSubmit={handleTrack} className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                        placeholder="Enter order ID or order number"
                        className="pl-11"
                      />
                    </div>
                    <Button type="submit" size="lg" isLoading={isLoading}>
                      Track order
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="info-chip">Direct tracking links supported</span>
                    <span className="info-chip">ERP order numbers supported</span>
                    <span className="info-chip">Invoice link shown when available</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    { icon: Package2, title: "See the current step", body: "The page shows the order stage without calling the store." },
                    { icon: Truck, title: "Follow delivery progress", body: "Ready, out for delivery, and delivered states are all shown here." },
                    { icon: FileText, title: "Open invoice when ready", body: "Invoice access appears as soon as billing is attached to the order." },
                  ].map((item) => (
                    <div key={item.title} className="surface-soft p-4">
                      <item.icon className="h-5 w-5 text-primary" />
                      <p className="mt-3 font-black text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </FadeIn>
        </section>

        <AnimatePresence mode="wait">
          {order ? (
            <motion.section key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="container-wide pb-20">
              <Card className="p-6 sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Order identifier</p>
                    <h2 className="mt-3 break-all text-3xl font-black sm:text-4xl">{order.reference}</h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">ERP order ID: {order.orderId}</p>
                  </div>
                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <Badge className={statusClass}>{order.status.replace(/_/g, " ")}</Badge>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4 text-primary" />
                      Last updated {new Date(order.updatedAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <StageRail order={order} />
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Customer", value: order.customerName || "Fab Clean Customer" },
                      { label: "Total", value: formatCurrency(order.totalAmount || 0) },
                      { label: "Payment", value: order.paymentStatus || "pending" },
                      {
                        label: "Pickup date",
                        value: order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString("en-IN") : "Awaiting schedule",
                      },
                    ].map((item) => (
                      <div key={item.label} className="surface-soft p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{item.label}</p>
                        <p className="mt-3 text-lg font-black text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="surface-soft p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Services and actions</p>
                    <div className="mt-4 space-y-3">
                      {(order.services.length ? order.services : ["Laundry service"]).map((service, index) => (
                        <div key={`${service}-${index}`} className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground">
                          {service}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 grid gap-3">
                      {order.invoiceUrl ? (
                        <a href={order.invoiceUrl} target="_blank" rel="noreferrer">
                          <Button className="w-full">Open invoice</Button>
                        </a>
                      ) : null}
                      <Link href={`/feedback/${encodeURIComponent(order.reference || order.orderId)}`}>
                        <Button variant="outline" className="w-full">Leave feedback</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
