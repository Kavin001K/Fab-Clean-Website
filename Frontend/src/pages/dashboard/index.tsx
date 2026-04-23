import { useEffect, useMemo } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useGetOrder, useListOrders, useUpdateProfile } from "@workspace/api-client-react";
import {
  CreditCard,
  Loader2,
  LogOut,
  Mail,
  Package,
  Phone,
  User,
  Wallet,
} from "lucide-react";
import { AppLayout } from "@/components/layout";
import { useAuth, useRequireAuth } from "@/hooks/use-auth";
import { Badge, Button, Card, FadeIn, Input, SectionHeading } from "@/components/ui";
import { StatusTimeline } from "@/components/site";
import { fetchWalletSummary } from "@/lib/portal-api";

type ProfileFormValues = {
  name: string;
  email: string;
};

const ORDER_STAGES = ["pending", "processing", "ready_for_pickup", "out_for_delivery", "delivered"] as const;

const ORDER_STAGE_LABELS: Record<(typeof ORDER_STAGES)[number], string> = {
  pending: "Order received",
  processing: "In cleaning",
  ready_for_pickup: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

function formatMoney(value: number | string | null | undefined) {
  return `₹${Number(value ?? 0).toFixed(0)}`;
}

function formatDateTime(value?: string | null) {
  if (!value) return "Awaiting update";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Awaiting update";
  return format(date, "dd MMM yyyy, p");
}

function DashboardSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const links = [
    { name: "Orders", path: "/dashboard/orders", blurb: "Live order list and details" },
    { name: "Profile", path: "/dashboard/profile", blurb: "Customer record fields" },
    { name: "Wallet", path: "/dashboard/wallet", blurb: "Balance and spending summary" },
  ];

  return (
    <aside className="w-full lg:w-[290px]">
      <div className="visual-card p-5">
        <p className="eyebrow">Portal navigation</p>
        <div className="mt-6 grid gap-2">
          {links.map((link) => {
            const active = location.startsWith(link.path) || (location === "/dashboard" && link.path === "/dashboard/orders");
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`rounded-[1.35rem] border px-4 py-4 transition-colors ${active ? "border-primary/20 bg-primary/10" : "border-line bg-background/70"}`}
              >
                <p className="font-medium text-ink">{link.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{link.blurb}</p>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={logout}
            className="rounded-[1.35rem] border border-line bg-background/70 px-4 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium text-ink">Sign out</p>
                <p className="mt-1 text-sm text-muted-foreground">End this customer session</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

function DashboardOverview() {
  const ordersQuery = useListOrders();
  const { profile } = useRequireAuth();

  const stats = useMemo(() => {
    const orders = ordersQuery.data?.data ?? [];
    const total = orders.length;
    const active = orders.filter((order) => order.status !== "delivered").length;
    const delivered = orders.filter((order) => order.status === "delivered").length;
    const spend = orders.reduce((sum, order) => sum + Number(order.totalAmount ?? 0), 0);

    return [
      { label: "Total orders", value: total.toString(), hint: "Orders linked to this portal", icon: Package },
      { label: "Active", value: active.toString(), hint: "Still in progress", icon: Package },
      { label: "Delivered", value: delivered.toString(), hint: "Completed successfully", icon: CreditCard },
      { label: "Tracked spend", value: formatMoney(spend), hint: "Visible order total", icon: Wallet },
    ];
  }, [ordersQuery.data?.data]);

  return (
    <div className="space-y-6">
      <Card className="lux-card p-7">
        <Badge>Signed in customer</Badge>
        <h2 className="mt-5 font-display text-4xl text-ink">Welcome, {profile?.name || "Fab Clean Customer"}</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
          The dashboard redesign keeps the backend behavior intact while making the portal less noisy and easier to scan.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <FadeIn key={stat.label} delay={index * 0.04}>
            <Card className="lux-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-ink">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.hint}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function OrdersList() {
  const { data, isLoading, error } = useListOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="lux-card p-6">
        <p className="font-display text-3xl text-ink">Unable to load orders right now.</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">Please try again shortly.</p>
      </Card>
    );
  }

  if (!data?.data?.length) {
    return (
      <Card className="lux-card p-6">
        <p className="font-display text-3xl text-ink">No orders yet.</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">Book a pickup to start using order tracking and feedback history.</p>
        <div className="mt-6">
          <Link href="/schedule-pickup">
            <Button>Schedule pickup</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {data.data.map((order, index) => (
        <FadeIn key={order.id} delay={index * 0.03}>
          <Link href={`/dashboard/track/${order.id}`}>
            <Card className="lux-card p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-2xl font-semibold text-ink">{order.reference}</p>
                    <Badge variant="outline">{order.status.replace(/_/g, " ")}</Badge>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <p>{formatDateTime(order.createdAt)}</p>
                    <p>Branch: {order.branch || "Pickup"}</p>
                    <p>Services: {order.services.length || 0}</p>
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-line bg-background/70 px-5 py-5 text-right">
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Total</p>
                  <p className="mt-3 text-2xl font-semibold text-ink">{formatMoney(order.totalAmount)}</p>
                </div>
              </div>
            </Card>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}

function OrderTrack({ id }: { id: string }) {
  const { data, isLoading, error } = useGetOrder(id);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <Card className="lux-card p-6">
        <p className="font-display text-3xl text-ink">Order not found.</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">This order is not available in your portal scope.</p>
      </Card>
    );
  }

  const order = data.data;
  const currentIndex = Math.max(ORDER_STAGES.indexOf(order.status as (typeof ORDER_STAGES)[number]), 0);

  return (
    <div className="space-y-6">
      <Card className="lux-card p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge>Order detail</Badge>
            <h2 className="mt-5 font-display text-4xl text-ink">{order.reference}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              This timeline mirrors the live store status so the customer portal stays aligned with operations.
            </p>
          </div>
          <Badge variant="outline">{order.status.replace(/_/g, " ")}</Badge>
        </div>

        <div className="mt-8">
          <StatusTimeline
            activeIndex={currentIndex}
            steps={ORDER_STAGES.map((stage) => ({ label: ORDER_STAGE_LABELS[stage], meta: stage.replace(/_/g, " ") }))}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="lux-card p-7">
          <p className="eyebrow">Services and timeline</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              {(order.services.length ? order.services : ["Service details unavailable"]).map((service, idx) => (
                <div key={`${service}-${idx}`} className="rounded-[1.3rem] border border-line bg-background/70 px-4 py-4 text-sm text-ink">
                  {service}
                </div>
              ))}
            </div>
            <div className="rounded-[1.4rem] border border-line bg-background/70 p-5">
              <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Lifecycle snapshot</p>
              <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-4">
                  <dt>Placed</dt>
                  <dd>{formatDateTime(order.createdAt)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Scheduled</dt>
                  <dd>{formatDateTime(order.scheduledDate)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Status</dt>
                  <dd className="font-medium text-ink">{order.status.replace(/_/g, " ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="lux-card p-7">
          <p className="eyebrow">Commercial summary</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[1.4rem] border border-line bg-background/70 p-5">
              <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Total amount</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{formatMoney(order.totalAmount)}</p>
            </div>
            <div className="rounded-[1.4rem] border border-line bg-background/70 p-5">
              <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Order ID</p>
              <p className="mt-3 break-all text-sm text-muted-foreground">{order.id}</p>
            </div>
            <Link href={`/feedback/${order.reference}`}>
              <Button className="w-full">Leave feedback</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProfilePanel() {
  const queryClient = useQueryClient();
  const { profile } = useRequireAuth();
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: profile?.name || "",
      email: profile?.email || "",
    });
  }, [form, profile?.email, profile?.name]);

  const updateProfile = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ["/api/users/profile"] });
      },
    } as never,
  });

  return (
    <Card className="lux-card p-7">
      <div className="mb-8">
        <Badge>Profile</Badge>
        <h2 className="mt-5 font-display text-4xl text-ink">Customer identity</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Phone stays locked because sign-in uses OTP. Name and email can be updated here and kept aligned with the linked customer profile.
        </p>
      </div>

      <form className="grid gap-5 md:grid-cols-2" onSubmit={form.handleSubmit((values) => updateProfile.mutate({ data: values }))}>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-ink">Phone</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={profile?.phone || ""} readOnly className="pl-11 text-muted-foreground" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...form.register("name")} className="pl-11" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...form.register("email")} className="pl-11" />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-muted-foreground">Additional customer fields can be exposed later without reworking the layout structure again.</p>
          <Button type="submit" isLoading={updateProfile.isPending}>Save profile</Button>
        </div>
      </form>
    </Card>
  );
}

function WalletPanel() {
  const { token } = useAuth();
  const walletQuery = useQuery({
    queryKey: ["wallet-summary"],
    queryFn: () => fetchWalletSummary(token!),
    enabled: Boolean(token),
  });

  if (walletQuery.isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (walletQuery.isError || !walletQuery.data?.data) {
    return (
      <Card className="lux-card p-6">
        <p className="font-display text-3xl text-ink">Wallet summary is temporarily unavailable.</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">Please try again in a moment.</p>
      </Card>
    );
  }

  const wallet = walletQuery.data.data;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Wallet balance", value: formatMoney(wallet.balance), hint: "Current available value" },
        { label: "Credit balance", value: formatMoney(wallet.creditBalance), hint: "Outstanding credit view" },
        { label: "Total orders", value: wallet.totalOrders.toString(), hint: "Orders linked to this customer" },
        { label: "Total spent", value: formatMoney(wallet.totalSpent), hint: "Visible order spend" },
      ].map((item, index) => (
        <FadeIn key={item.label} delay={index * 0.04}>
          <Card className="lux-card p-5">
            <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{item.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.hint}</p>
          </Card>
        </FadeIn>
      ))}

      <Card className="lux-card p-6 md:col-span-2 xl:col-span-4">
        <p className="font-display text-3xl text-ink">Wallet history can expand later.</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          This release focuses on a clearer wallet snapshot while leaving deeper wallet history and credits detail for a later backend expansion.
        </p>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { profile, isLoading } = useRequireAuth();
  const [location] = useLocation();

  const greeting = useMemo(() => profile?.name?.split(" ")[0] || "Customer", [profile?.name]);

  if (isLoading || !profile) return null;

  return (
    <AppLayout>
      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading align="left" title={`Hello, ${greeting}`} subtitle="Customer dashboard" />
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Orders, profile, and wallet status now sit inside a more composed portal shell without changing the backend contract.
          </p>
        </section>

        <section className="container-wide pb-24">
          <DashboardOverview />

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
            <DashboardSidebar />
            <main className="flex-1 space-y-6">
              <Switch>
                <Route path="/dashboard" component={OrdersList} />
                <Route path="/dashboard/orders" component={OrdersList} />
                <Route path="/dashboard/track/:id">{(params) => <OrderTrack id={params.id} />}</Route>
                <Route path="/dashboard/profile" component={ProfilePanel} />
                <Route path="/dashboard/wallet" component={WalletPanel} />
                <Route>{location.startsWith("/dashboard") ? <OrdersList /> : null}</Route>
              </Switch>
            </main>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
