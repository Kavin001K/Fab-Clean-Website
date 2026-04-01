import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPublicTrackOrder } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, Input, SectionHeading } from "@/components/ui";
import { cn, formatCurrency } from "@/lib/utils";
import {
  buildTrackingSteps,
  getOrderStatusLabel,
  getOrderStatusTone,
} from "@/lib/customer-experience";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  MessageCircle,
  Package2,
  RefreshCw,
  Search,
  Shirt,
  Sparkles,
  Truck,
} from "lucide-react";

const stepIcons = [Package2, Shirt, Truck, CheckCircle2];

export default function TrackOrderPage() {
  const [, params] = useRoute("/trackorder/:orderNumber");
  const [, setLocation] = useLocation();
  const [searchValue, setSearchValue] = useState(params?.orderNumber || "");
  const activeOrderNumber = params?.orderNumber || "";

  useEffect(() => {
    if (params?.orderNumber) {
      setSearchValue(params.orderNumber);
    }
  }, [params?.orderNumber]);

  const orderQuery = useGetPublicTrackOrder(activeOrderNumber, {
    query: {
      retry: false,
    } as any,
  });

  const order = orderQuery.data?.data || null;
  const steps = useMemo(
    () => (order ? order.steps || buildTrackingSteps(order) : []),
    [order]
  );

  const onSearch = () => {
    if (!searchValue.trim()) return;
    setLocation(`/trackorder/${encodeURIComponent(searchValue.trim())}`);
  };

  return (
    <AppLayout>
      <SEO
        title="Track Order | Fab Clean"
        description="Track your Fab Clean order in real time with live status, garment summary, payment details, and invoice access."
        canonical={`https://myfabclean.com${activeOrderNumber ? `/trackorder/${encodeURIComponent(activeOrderNumber)}` : "/trackorder"}`}
      />

      <section className="relative overflow-hidden pt-36 pb-28">
        <div className="absolute inset-0 bg-premium-mesh opacity-80" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-[-8rem] h-72 w-72 rounded-full bg-primary/12 blur-[120px]" />
          <div className="absolute bottom-0 left-[-6rem] h-80 w-80 rounded-full bg-accent/12 blur-[120px]" />
        </div>

        <div className="container-wide relative z-10 space-y-14">
          <FadeIn>
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-8 bg-white/80 text-primary border border-primary/15">
                Real-Time Order Tracking
              </Badge>
              <SectionHeading
                title="Follow Every Step of Your Fab Clean Order"
                subtitle="Customer Portal"
                className="mb-8"
              />
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Enter your ERP order number to view the live garment journey, payment status,
                invoice access, and service updates in one place.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="mx-auto max-w-4xl rounded-[3rem] bg-white/85 p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                  <Input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") onSearch();
                    }}
                    className="pl-14"
                    placeholder="Enter your order number"
                  />
                </div>
                <Button size="lg" className="md:min-w-[220px]" onClick={onSearch}>
                  Track Order
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </FadeIn>

          <AnimatePresence mode="wait">
            {orderQuery.isLoading && activeOrderNumber ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="flex min-h-[240px] items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Checking the latest status from our ERP...</p>
                </div>
              </motion.div>
            ) : null}

            {orderQuery.isError && activeOrderNumber ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
              >
                <Card className="mx-auto max-w-3xl rounded-[3rem] bg-white/90 p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-50 text-rose-600">
                    <Package2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground">We couldn&apos;t find that order</h3>
                  <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                    Double-check the order number from WhatsApp or your invoice and try again.
                  </p>
                </Card>
              </motion.div>
            ) : null}

            {order ? (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <Card className="overflow-hidden rounded-[3.5rem] bg-[#0B1C3B] p-8 md:p-12 text-white">
                  <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
                    <div>
                      <div className="mb-5 flex flex-wrap items-center gap-3">
                        <Badge className="bg-white/10 text-white border border-white/10">
                          Order {order.orderNumber}
                        </Badge>
                        <Badge className={cn("border-none", getOrderStatusTone(order.status))}>
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <h2 className="max-w-2xl text-4xl font-black leading-tight md:text-5xl">
                        Your garments are moving through our premium care pipeline.
                      </h2>
                      <p className="mt-5 max-w-2xl text-base text-white/70 md:text-lg">
                        Branch: {order.branch} • Payment: {order.paymentStatus.replace(/_/g, " ")}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      <div className="rounded-[2rem] border border-white/10 bg-white/8 p-5">
                        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-white/45">
                          Total
                        </div>
                        <div className="mt-3 text-3xl font-black">
                          {formatCurrency(order.totalAmount || 0)}
                        </div>
                      </div>
                      <div className="rounded-[2rem] border border-white/10 bg-white/8 p-5">
                        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-white/45">
                          Updated
                        </div>
                        <div className="mt-3 text-lg font-bold">
                          {new Date(order.updatedAt || order.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                  <Card className="rounded-[3rem] bg-white/88 p-8 md:p-10">
                    <div className="mb-8 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">
                          Live Timeline
                        </p>
                        <h3 className="mt-3 text-3xl font-black text-foreground">Current order progress</h3>
                      </div>
                      <Button
                        variant="outline"
                        className="h-14 rounded-[1.5rem]"
                        onClick={() => orderQuery.refetch()}
                        isLoading={orderQuery.isFetching}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                      </Button>
                    </div>

                    <div className="grid gap-5">
                      {steps.map((step, index) => {
                        const Icon = stepIcons[index] || Sparkles;
                        return (
                          <motion.div
                            key={step.key}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.06 }}
                            className={cn(
                              "relative flex items-start gap-5 rounded-[2rem] border px-5 py-5 transition-all",
                              step.current
                                ? "border-primary/30 bg-primary/8 shadow-[0_20px_50px_-35px_rgba(28,136,199,0.55)]"
                                : step.completed
                                  ? "border-emerald-200 bg-emerald-50/70"
                                  : "border-border bg-muted/20"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.5rem]",
                                step.current
                                  ? "bg-brand-gradient text-white"
                                  : step.completed
                                    ? "bg-emerald-500 text-white"
                                    : "bg-white text-muted-foreground border border-border"
                              )}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <h4 className="text-xl font-black text-foreground">{step.label}</h4>
                                {step.current ? (
                                  <Badge className="bg-primary/10 text-primary border border-primary/15">
                                    Current
                                  </Badge>
                                ) : null}
                                {!step.current && step.completed ? (
                                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                                    Complete
                                  </Badge>
                                ) : null}
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">
                                {step.current
                                  ? "This is the latest update reflected from the ERP system."
                                  : step.completed
                                    ? "This service stage has already been completed."
                                    : "This stage will unlock automatically as your order advances."}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>

                  <div className="grid gap-8">
                    <Card className="rounded-[3rem] bg-white/88 p-8">
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">
                        Order Snapshot
                      </p>
                      <div className="mt-6 space-y-5">
                        <div>
                          <div className="text-sm text-muted-foreground">Customer</div>
                          <div className="text-xl font-bold text-foreground">{order.customerName || "Fab Clean Customer"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Fulfillment</div>
                          <div className="text-xl font-bold capitalize text-foreground">{order.fulfillmentType}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Pickup / Delivery Date</div>
                          <div className="text-xl font-bold text-foreground">
                            {order.pickupDate
                              ? new Date(order.pickupDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "To be confirmed"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        {order.invoiceUrl ? (
                          <Button
                            variant="outline"
                            className="h-14 rounded-[1.5rem]"
                            onClick={() => window.open(order.invoiceUrl!, "_blank")}
                          >
                            <Download className="h-4 w-4" />
                            Invoice
                          </Button>
                        ) : null}
                        <Link href={`/feedback?orderId=${encodeURIComponent(order.id)}`}>
                          <Button className="h-14 rounded-[1.5rem]">
                            <MessageCircle className="h-4 w-4" />
                            Leave Feedback
                          </Button>
                        </Link>
                      </div>
                    </Card>

                    <Card className="rounded-[3rem] bg-white/88 p-8">
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">
                        Garment Summary
                      </p>
                      <div className="mt-6 space-y-4">
                        {order.items.map((item, index) => (
                          <div
                            key={`${item.serviceName}-${index}`}
                            className="flex items-center justify-between rounded-[1.6rem] bg-muted/30 px-4 py-4"
                          >
                            <div>
                              <div className="font-bold text-foreground">{item.serviceName}</div>
                              <div className="text-sm text-muted-foreground">Quantity {item.quantity}</div>
                            </div>
                            <div className="text-right font-bold text-foreground">
                              {formatCurrency(item.price || 0)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ) : !activeOrderNumber ? (
              <FadeIn delay={0.15}>
                <Card className="mx-auto max-w-4xl rounded-[3rem] bg-white/88 p-10 md:p-14">
                  <div className="grid gap-10 md:grid-cols-2 md:items-center">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">
                        Need Help?
                      </p>
                      <h3 className="mt-4 text-4xl font-black text-foreground">Track with your order number from WhatsApp or invoice.</h3>
                      <p className="mt-4 text-muted-foreground">
                        Every update on this page comes directly from FabZClean-T1, so you always see the latest operational status.
                      </p>
                    </div>
                    <div className="rounded-[2.5rem] bg-premium-mesh p-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.7rem] bg-brand-gradient text-white">
                          <Clock3 className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="text-xl font-black text-foreground">Fast status refresh</div>
                          <div className="text-sm text-muted-foreground">
                            Live stages for pickup and delivery orders.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </AppLayout>
  );
}
