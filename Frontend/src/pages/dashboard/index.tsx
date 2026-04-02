import { useEffect, useMemo } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useGetOrder, useListOrders, useUpdateProfile } from "@workspace/api-client-react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
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
import { fetchWalletSummary } from "@/lib/portal-api";

type ProfileFormValues = {
  name: string;
  email: string;
};

const ORDER_STAGES = ["pending", "processing", "ready_for_pickup", "out_for_delivery", "delivered"] as const;

const ORDER_STAGE_LABELS: Record<(typeof ORDER_STAGES)[number], string> = {
  pending: "Order received",
  processing: "In cleaning process",
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
    { name: "Orders", path: "/dashboard/orders", icon: Package, blurb: "See all customer orders" },
    { name: "Profile", path: "/dashboard/profile", icon: User, blurb: "Update your visible details" },
    { name: "Wallet", path: "/dashboard/wallet", icon: Wallet, blurb: "Check wallet and credit" },
  ];

  return (
    <aside className="w-full lg:w-[280px]">
      <Card className="p-4">
        <p className="px-2 text-sm font-black uppercase tracking-[0.16em] text-primary">Customer portal</p>
        <div className="mt-4 grid gap-2">
          {links.map((link) => {
            const active = location.startsWith(link.path) || (location === "/dashboard" && link.path === "/dashboard/orders");
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`rounded-[1.3rem] px-4 py-4 transition-colors ${active ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? "bg-white text-primary" : "bg-white text-foreground/70"}`}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black">{link.name}</p>
                    <p className="text-xs text-muted-foreground">{link.blurb}</p>
                  </div>
                </div>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={logout}
            className="rounded-[1.3rem] px-4 py-4 text-left text-foreground/70 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-foreground/70">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black">Sign out</p>
                <p className="text-xs text-muted-foreground">End this customer session</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
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
      { label: "Total orders", value: total.toString(), hint: "Orders visible in your portal", icon: Package },
      { label: "Active orders", value: active.toString(), hint: "Orders still in progress", icon: Clock3 },
      { label: "Delivered", value: delivered.toString(), hint: "Orders completed successfully", icon: CheckCircle2 },
      { label: "Tracked spend", value: formatMoney(spend), hint: "Visible order total", icon: CreditCard },
    ];
  }, [ordersQuery.data?.data]);

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-7">
        <Badge>Signed in customer</Badge>
        <h2 className="mt-4 text-3xl font-black sm:text-4xl">Welcome, {profile?.name || "Fab Clean Customer"}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          Your portal is tied to the same customer record used by operations. That keeps order progress, customer identity, and feedback linked without exposing other customer data.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <FadeIn key={stat.label} delay={index * 0.04}>
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{stat.label}</p>
                  <p className="mt-3 text-3xl font-black">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.hint}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
      <Card className="p-6">
        <p className="text-lg font-black">Unable to load orders right now.</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">Please try again shortly.</p>
      </Card>
    );
  }

  if (!data?.data?.length) {
    return (
      <Card className="p-6">
        <p className="text-lg font-black">No orders yet.</p>
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
        <FadeIn key={order.id} delay={index * 0.04}>
          <Link href={`/dashboard/track/${order.id}`}>
            <Card className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="break-all text-xl font-black sm:text-2xl">{order.reference}</p>
                    <Badge>{order.status.replace(/_/g, " ")}</Badge>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-3">
                    <p>{formatDateTime(order.createdAt)}</p>
                    <p>Branch: {order.branch || "Pickup"}</p>
                    <p>Services: {order.services.length || 0}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:min-w-[220px]">
                  <div className="rounded-[1.3rem] bg-muted/70 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Total</p>
                    <p className="mt-2 text-2xl font-black">{formatMoney(order.totalAmount)}</p>
                  </div>
                  <Button variant="outline" className="justify-center">
                    View order
                    <ArrowRight className="h-4 w-4" />
                  </Button>
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
      <Card className="p-6">
        <p className="text-lg font-black">Order not found.</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">This order is not available in your portal scope.</p>
      </Card>
    );
  }

  const order = data.data;
  const currentIndex = Math.max(ORDER_STAGES.indexOf(order.status as (typeof ORDER_STAGES)[number]), 0);

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge>Order detail</Badge>
            <h2 className="mt-4 break-all text-3xl font-black sm:text-4xl">{order.reference}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              This timeline is read from the operations database, so the customer portal stays aligned with the live store status.
            </p>
          </div>
          <Badge>{order.status.replace(/_/g, " ")}</Badge>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {ORDER_STAGES.map((stage, index) => {
            const complete = index <= currentIndex;
            return (
              <div key={stage} className={`rounded-[1.25rem] border p-4 ${complete ? "border-primary/20 bg-primary/10" : "border-border bg-white"}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${complete ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-foreground">{ORDER_STAGE_LABELS[stage]}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stage.replace(/_/g, " ")}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.88fr]">
        <Card className="p-6">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">Services and timeline</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              {(order.services.length ? order.services : ["Service details unavailable"]).map((service, idx) => (
                <div key={`${service}-${idx}`} className="rounded-[1.2rem] border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground">
                  {service}
                </div>
              ))}
            </div>
            <div className="rounded-[1.3rem] bg-muted/70 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Lifecycle snapshot</p>
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
                  <dd className="font-bold text-foreground">{order.status.replace(/_/g, " ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">Commercial summary</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.25rem] bg-muted/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Total amount</p>
              <p className="mt-2 text-3xl font-black">{formatMoney(order.totalAmount)}</p>
            </div>
            <div className="rounded-[1.25rem] bg-muted/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Order ID</p>
              <p className="mt-2 break-all text-sm text-muted-foreground">{order.id}</p>
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
    <Card className="p-6 sm:p-7">
      <div className="mb-8">
        <Badge>Profile</Badge>
        <h2 className="mt-4 text-3xl font-black">Your customer identity</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Phone remains locked because sign-in uses OTP. Name and email can be updated here and kept aligned with the linked customer profile.
        </p>
      </div>

      <form className="grid gap-5 md:grid-cols-2" onSubmit={form.handleSubmit((values) => updateProfile.mutate({ data: values }))}>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-foreground">Phone</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={profile?.phone || ""} readOnly className="pl-11 text-muted-foreground" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-foreground">Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...form.register("name")} className="pl-11" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-foreground">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...form.register("email")} className="pl-11" />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-muted-foreground">Address and date of birth can be surfaced here once the typed portal contract is expanded.</p>
          <Button type="submit" isLoading={updateProfile.isPending}>
            Save profile
          </Button>
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
      <Card className="p-6">
        <p className="text-lg font-black">Wallet summary is temporarily unavailable.</p>
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
          <Card className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{item.label}</p>
            <p className="mt-3 text-3xl font-black">{item.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.hint}</p>
          </Card>
        </FadeIn>
      ))}

      <Card className="p-6 md:col-span-2 xl:col-span-4">
        <p className="text-lg font-black">Wallet history can expand later.</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          This release focuses on wallet summary visibility and portal stability. The current screen keeps the customer-facing data simple while the backend structure stays secure.
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
            Track orders, update your profile, and review wallet status from one lighter, easier-to-read dashboard.
          </p>
        </section>

        <section className="container-wide pb-20">
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
