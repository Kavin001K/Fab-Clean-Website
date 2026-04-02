import { useEffect, useMemo } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useGetOrder, useListOrders, useUpdateProfile } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { useAuth, useRequireAuth } from "@/hooks/use-auth";
import { Badge, Button, Card, FadeIn, Input } from "@/components/ui";
import { fetchWalletSummary } from "@/lib/portal-api";
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
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";

type ProfileFormValues = {
  name: string;
  email: string;
};

const ORDER_STAGES = ["pending", "processing", "ready_for_pickup", "out_for_delivery", "delivered"] as const;

const ORDER_STAGE_LABELS: Record<(typeof ORDER_STAGES)[number], string> = {
  pending: "Order Received",
  processing: "Cleaning In Progress",
  ready_for_pickup: "Ready For Pickup",
  out_for_delivery: "Out For Delivery",
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
    { name: "Orders", path: "/dashboard/orders", icon: Package, blurb: "Track live progress" },
    { name: "Profile", path: "/dashboard/profile", icon: User, blurb: "Update account details" },
    { name: "Wallet", path: "/dashboard/wallet", icon: Wallet, blurb: "See balance and credits" },
  ];

  return (
    <aside className="w-full lg:w-[320px]">
      <Card className="border-white/10 bg-[#08152e]/90 p-4 text-white shadow-[0_40px_100px_-45px_rgba(16,124,255,0.5)]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">Portal Navigation</p>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Move between live orders, customer identity, and wallet visibility without losing context.
          </p>
        </div>

        <div className="mt-4 grid gap-3">
          {links.map((link) => {
            const active = location.startsWith(link.path) || (location === "/dashboard" && link.path === "/dashboard/orders");
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`group rounded-[1.8rem] border px-4 py-4 transition-all ${
                  active
                    ? "border-primary/40 bg-[linear-gradient(135deg,rgba(65,143,255,0.22),rgba(111,224,183,0.18))] text-white shadow-lg shadow-primary/10"
                    : "border-white/8 bg-white/[0.035] text-white/70 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[1.1rem] border ${
                      active ? "border-white/20 bg-white/10" : "border-white/8 bg-white/5"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black uppercase tracking-[0.18em]">{link.name}</p>
                    <p className="mt-1 text-xs text-white/45">{link.blurb}</p>
                  </div>
                </div>
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="group rounded-[1.8rem] border border-white/8 bg-white/[0.035] px-4 py-4 text-left text-white/70 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-white/8 bg-white/5">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em]">Sign Out</p>
                <p className="mt-1 text-xs text-white/45">End this portal session</p>
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
      { label: "Total Orders", value: total.toString(), hint: "Full portal history", icon: Package },
      { label: "Active Orders", value: active.toString(), hint: "Still in progress", icon: Clock3 },
      { label: "Delivered", value: delivered.toString(), hint: "Completed successfully", icon: CheckCircle2 },
      { label: "Tracked Spend", value: formatMoney(spend), hint: "Based on visible order totals", icon: CreditCard },
    ];
  }, [ordersQuery.data?.data]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <FadeIn key={stat.label} delay={index * 0.05}>
          <Card className="border-white/10 bg-[#08152e]/85 p-5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">{stat.label}</p>
                <p className="mt-3 text-3xl font-black">{stat.value}</p>
                <p className="mt-2 text-sm text-white/55">{stat.hint}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/5">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        </FadeIn>
      ))}

      <Card className="border-white/10 bg-[#08152e]/85 p-5 text-white md:col-span-2 xl:col-span-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Account Status</p>
            <h2 className="mt-3 text-2xl font-black">Signed in as {profile?.name || "Fab Clean Customer"}</h2>
            <p className="mt-2 max-w-2xl text-white/55">
              Your portal is connected to the operational customer record for the same phone number, so store updates,
              billing status, and order progress stay aligned.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/profile">
              <Button variant="outline" className="rounded-[1.4rem] border-white/15 bg-white/5 text-white">
                Profile
              </Button>
            </Link>
            <Link href="/dashboard/wallet">
              <Button className="rounded-[1.4rem]">Wallet</Button>
            </Link>
          </div>
        </div>
      </Card>
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
      <Card className="border-white/10 bg-[#08152e]/85 p-8 text-white">
        <p className="text-lg font-bold">Unable to load orders right now.</p>
        <p className="mt-2 text-white/55">The portal is reachable, but the order feed could not be refreshed. Try again shortly.</p>
      </Card>
    );
  }

  if (!data?.data?.length) {
    return (
      <Card className="border-white/10 bg-[#08152e]/85 p-8 text-white">
        <p className="text-lg font-bold">No orders yet.</p>
        <p className="mt-2 text-white/55">Schedule your first pickup to start seeing real-time order progress here.</p>
        <div className="mt-6">
          <Link href="/schedule-pickup">
            <Button className="rounded-[1.6rem]">Schedule Pickup</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-5">
      {data.data.map((order, index) => (
        <FadeIn key={order.id} delay={index * 0.04}>
          <Link href={`/dashboard/track/${order.id}`}>
            <Card className="group border-white/10 bg-[#08152e]/85 p-6 text-white transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_35px_90px_-55px_rgba(91,167,255,0.65)]">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="break-all text-xl font-black md:text-2xl">{order.reference}</p>
                    <Badge className="border-white/10 bg-white/10 text-white">{order.status.replace(/_/g, " ")}</Badge>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-white/55 md:grid-cols-2 xl:grid-cols-3">
                    <p className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {formatDateTime(order.createdAt)}
                    </p>
                    <p>Branch: {order.branch || "Pickup"}</p>
                    <p>Services: {order.services.length || 0}</p>
                  </div>
                </div>

                <div className="grid gap-3 md:min-w-[220px]">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Total</p>
                    <p className="mt-2 text-2xl font-black">{formatMoney(order.totalAmount)}</p>
                  </div>
                  <Button variant="outline" className="rounded-[1.4rem] border-white/15 bg-white/5 text-white group-hover:border-primary/30">
                    View Order
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
      <Card className="border-white/10 bg-[#08152e]/85 p-8 text-white">
        <p className="text-lg font-bold">Order not found.</p>
        <p className="mt-2 text-white/55">This order is not available in your customer portal scope.</p>
      </Card>
    );
  }

  const order = data.data;
  const currentIndex = Math.max(ORDER_STAGES.indexOf(order.status as (typeof ORDER_STAGES)[number]), 0);

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-[#08152e]/88 p-6 text-white md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">Live Order Detail</p>
            <h2 className="mt-3 break-all text-3xl font-black md:text-4xl">{order.reference}</h2>
            <p className="mt-3 max-w-xl text-white/55">
              Progress is read directly from the operations database so this timeline stays aligned with in-store updates.
            </p>
          </div>
          <Badge className="w-fit border-white/10 bg-white/10 text-white">{order.status.replace(/_/g, " ")}</Badge>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {ORDER_STAGES.map((stage, index) => {
            const complete = index <= currentIndex;
            return (
                <div
                  key={stage}
                  className={`rounded-[1.8rem] border p-4 ${
                    complete ? "border-primary/30 bg-primary/10 text-white" : "border-white/10 bg-white/[0.03] text-white/45"
                  }`}
                >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                      complete ? "border-primary bg-primary text-white" : "border-white/15 bg-white/5 text-white/40"
                    }`}
                  >
                    {complete ? <CheckCircle2 className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.16em]">{ORDER_STAGE_LABELS[stage]}</p>
                    <p className="mt-1 text-xs text-inherit/70">{stage.replace(/_/g, " ")}</p>
                  </div>
                </div>
                </div>
              );
            })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/10 bg-[#08152e]/85 p-6 text-white lg:col-span-2">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Services & Timeline</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              {(order.services.length ? order.services : ["Service details unavailable"]).map((service, idx) => (
                <div key={`${service}-${idx}`} className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold">
                  {service}
                </div>
              ))}
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Lifecycle Snapshot</p>
              <dl className="mt-4 space-y-3 text-sm text-white/65">
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
                  <dd className="font-bold text-white">{order.status.replace(/_/g, " ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-[#08152e]/85 p-6 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Commercial Summary</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Total Amount</p>
              <p className="mt-2 text-3xl font-black">{formatMoney(order.totalAmount)}</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Order ID</p>
              <p className="mt-2 break-all text-sm text-white/70">{order.id}</p>
            </div>
            <Link href={`/feedback/${order.reference}`}>
              <Button className="w-full rounded-[1.4rem]">Leave Feedback</Button>
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
    <Card className="border-white/10 bg-[#08152e]/85 p-8 text-white">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">Profile Settings</p>
          <h2 className="mt-3 text-3xl font-black">Your Customer Identity</h2>
          <p className="mt-2 max-w-2xl text-white/55">
            Phone OTP remains the secure login anchor. Updating these fields keeps your customer-facing identity tidy across the portal.
          </p>
        </div>
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Realtime Link</p>
          <p className="mt-2 text-sm text-white/65">Name and email sync into the matching ERP customer record when available.</p>
        </div>
      </div>

      <form
        className="grid gap-6 md:grid-cols-2"
        onSubmit={form.handleSubmit((values) => updateProfile.mutate({ data: values }))}
      >
        <div className="md:col-span-2">
          <label className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-white/55">Phone</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input value={profile?.phone || ""} readOnly className="border-white/10 bg-white/5 pl-11 text-white/60" />
          </div>
          <p className="mt-2 text-xs text-white/40">Phone changes are intentionally locked because authentication is tied to this number.</p>
        </div>

        <div>
          <label className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-white/55">Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input {...form.register("name")} className="border-white/10 bg-white/5 pl-11 text-white" />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-white/55">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input {...form.register("email")} className="border-white/10 bg-white/5 pl-11 text-white" />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/45">Address and date of birth can be exposed here once the typed portal schema is expanded.</p>
          <Button type="submit" isLoading={updateProfile.isPending} className="rounded-[1.6rem]">
            Save Profile
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
      <Card className="border-white/10 bg-[#08152e]/85 p-8 text-white">
        <p className="text-lg font-bold">Wallet summary is temporarily unavailable.</p>
        <p className="mt-2 text-white/55">The portal is online, but the wallet feed did not return cleanly. Try again in a moment.</p>
      </Card>
    );
  }

  const wallet = walletQuery.data.data;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Wallet Balance", value: formatMoney(wallet.balance), hint: "Ready for settlement" },
        { label: "Credit Balance", value: formatMoney(wallet.creditBalance), hint: "Outstanding credit view" },
        { label: "Total Orders", value: wallet.totalOrders.toString(), hint: "Linked order count" },
        { label: "Total Spent", value: formatMoney(wallet.totalSpent), hint: "Captured spend total" },
      ].map((item, index) => (
        <FadeIn key={item.label} delay={index * 0.05}>
          <Card className="border-white/10 bg-[#08152e]/85 p-6 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">{item.label}</p>
            <p className="mt-4 text-3xl font-black">{item.value}</p>
            <p className="mt-2 text-sm text-white/50">{item.hint}</p>
          </Card>
        </FadeIn>
      ))}

      <Card className="border-white/10 bg-[#08152e]/85 p-6 text-white md:col-span-2 xl:col-span-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-lg font-bold">Wallet history can expand in the next phase.</p>
            <p className="mt-2 text-white/55">
              This release focuses on current balance, credit visibility, total orders, and spend summary while keeping the portal stable and mobile friendly.
            </p>
          </div>
        </div>
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
      <div className="relative overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(10,132,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(244,185,66,0.12),transparent_28%)]" />
        <div className="container-wide relative z-10 space-y-8">
          <div className="space-y-4">
            <Badge className="border-white/10 bg-white/10 text-white">Customer Portal</Badge>
            <h1 className="text-4xl font-black text-white md:text-5xl">Hello, {greeting}</h1>
            <p className="max-w-3xl text-white/55">
              Track every order, keep your profile aligned with operations, and monitor wallet visibility from one mobile-optimized portal.
            </p>
          </div>

          <DashboardOverview />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
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
        </div>
      </div>
    </AppLayout>
  );
}
