import { useEffect, useMemo } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useGetOrder, useListOrders, useUpdateProfile } from "@workspace/api-client-react";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Mail,
  Phone,
  User,
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

function BackToDashboard() {
  return (
    <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-ink transition-colors">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to dashboard
    </Link>
  );
}

function OrderCard({ order, index = 0 }: { order: any, index?: number }) {
  return (
    <FadeIn delay={index * 0.03}>
      <Link href={`/dashboard/track/${order.id}`}>
        <Card className="lux-card group relative p-6 transition-colors hover:border-primary/20 hover:bg-primary/[0.02]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-xl font-semibold text-ink">{order.reference}</p>
                <Badge variant="outline" className="bg-background/50">{order.status.replace(/_/g, " ")}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{formatDateTime(order.createdAt)} • {order.services.length || 0} items</p>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
                <p className="font-semibold text-ink">{formatMoney(order.totalAmount)}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </div>
        </Card>
      </Link>
    </FadeIn>
  );
}

function DashboardHome() {
  const { token, logout } = useAuth();
  const ordersQuery = useListOrders();
  const walletQuery = useQuery({
    queryKey: ["wallet-summary"],
    queryFn: () => fetchWalletSummary(token!),
    enabled: Boolean(token),
  });

  const orders = ordersQuery.data?.data ?? [];
  const activeOrdersCount = orders.filter((o) => o.status !== "delivered").length;
  const recentOrders = orders.slice(0, 3);
  
  const wallet = walletQuery.data?.data;

  return (
    <div className="space-y-10">
      {/* Quick Stats Grid */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card className="lux-card p-5 bg-gradient-to-br from-panel to-panel/50">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Wallet Balance</p>
          <p className="mt-2 text-3xl font-display text-ink">{wallet ? formatMoney(wallet.balance) : "..."}</p>
        </Card>
        <Card className="lux-card p-5 bg-gradient-to-br from-panel to-panel/50">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active Orders</p>
          <p className="mt-2 text-3xl font-display text-ink">{ordersQuery.isLoading ? "..." : activeOrdersCount}</p>
        </Card>
        <Card className="lux-card p-5 bg-gradient-to-br from-panel to-panel/50">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Orders</p>
          <p className="mt-2 text-3xl font-display text-ink">{ordersQuery.isLoading ? "..." : orders.length}</p>
        </Card>
        <Card className="lux-card p-5 bg-gradient-to-br from-panel to-panel/50">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Spent</p>
          <p className="mt-2 text-3xl font-display text-ink">{wallet ? formatMoney(wallet.totalSpent) : "..."}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/schedule-pickup" className="block">
          <Button className="w-full h-14 text-base shadow-sm">Book Pickup</Button>
        </Link>
        <Link href="/dashboard/orders" className="block">
          <Button variant="outline" className="w-full h-14 text-base bg-panel">View Orders</Button>
        </Link>
        <Link href="/dashboard/profile" className="block">
          <Button variant="outline" className="w-full h-14 text-base bg-panel">Profile & Settings</Button>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="font-display text-2xl text-ink">Recent orders</h3>
          {orders.length > 3 && (
            <Link href="/dashboard/orders" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          )}
        </div>
        
        {ordersQuery.isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : recentOrders.length === 0 ? (
          <Card className="lux-card p-8 text-center bg-panel/50">
            <p className="text-lg text-ink font-medium">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Book your first pickup to get started.</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {recentOrders.map((order, i) => <OrderCard key={order.id} order={order} index={i} />)}
          </div>
        )}
      </div>
      
      {/* Sign Out */}
      <div className="pt-4 border-t border-line">
        <Button variant="ghost" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50 -ml-2">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out safely
        </Button>
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
      <div className="max-w-2xl">
        <BackToDashboard />
        <Card className="lux-card p-6">
          <p className="font-display text-2xl text-ink">Unable to load orders.</p>
          <p className="mt-2 text-sm text-muted-foreground">Please try again shortly.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <BackToDashboard />
      <div className="mb-6 px-1">
        <h2 className="font-display text-3xl text-ink">All Orders</h2>
      </div>

      {!data?.data?.length ? (
        <Card className="lux-card p-8 text-center">
          <p className="text-lg font-medium text-ink">No orders found.</p>
          <div className="mt-4">
            <Link href="/schedule-pickup">
              <Button>Schedule pickup</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {data.data.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
          ))}
        </div>
      )}
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
      <div className="max-w-2xl">
        <BackToDashboard />
        <Card className="lux-card p-6">
          <p className="font-display text-2xl text-ink">Order not found.</p>
          <p className="mt-2 text-sm text-muted-foreground">This order is not available.</p>
        </Card>
      </div>
    );
  }

  const order = data.data;
  const currentIndex = Math.max(ORDER_STAGES.indexOf(order.status as (typeof ORDER_STAGES)[number]), 0);

  return (
    <div className="max-w-4xl space-y-6">
      <BackToDashboard />
      
      <Card className="lux-card p-6 md:p-8 border-t-4 border-t-primary">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-ink">Order {order.reference}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
          <Badge className="w-fit text-sm px-3 py-1">{order.status.replace(/_/g, " ")}</Badge>
        </div>

        <div className="mt-10">
          <StatusTimeline
            activeIndex={currentIndex}
            steps={ORDER_STAGES.map((stage) => ({ label: ORDER_STAGE_LABELS[stage], meta: stage.replace(/_/g, " ") }))}
          />
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="lux-card p-6 md:p-8">
          <h3 className="font-medium text-ink mb-4">Service Details</h3>
          <div className="space-y-3">
            {(order.services.length ? order.services : ["Standard care"]).map((service, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                {service}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-line">
            <p className="text-sm text-muted-foreground mb-1">Scheduled for</p>
            <p className="font-medium text-ink">{formatDateTime(order.scheduledDate)}</p>
          </div>
        </Card>

        <Card className="lux-card p-6 md:p-8 bg-panel/30">
          <h3 className="font-medium text-ink mb-6">Payment Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-ink">{formatMoney(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-primary font-medium">Free</span>
            </div>
            <div className="pt-4 mt-4 border-t border-line flex justify-between items-center">
              <span className="font-medium text-ink">Total</span>
              <span className="text-2xl font-semibold text-ink">{formatMoney(order.totalAmount)}</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href={`/feedback/${order.reference}`}>
              <Button variant="outline" className="w-full">Leave Feedback</Button>
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
    <div className="max-w-2xl">
      <BackToDashboard />
      <div className="mb-6 px-1">
        <h2 className="font-display text-3xl text-ink">Profile & Settings</h2>
      </div>

      <Card className="lux-card p-6 md:p-8">
        <form className="space-y-6" onSubmit={form.handleSubmit((values) => updateProfile.mutate({ data: values }))}>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Registered Phone</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={profile?.phone || ""} readOnly className="pl-11 bg-background/50 text-muted-foreground cursor-not-allowed" />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">Phone number cannot be changed as it acts as your secure login ID.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Full Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input {...form.register("name")} className="pl-11" placeholder="Your name" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input {...form.register("email")} type="email" className="pl-11" placeholder="you@example.com" />
            </div>
          </div>

          <div className="pt-4 border-t border-line">
            <Button type="submit" isLoading={updateProfile.isPending}>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { profile, isLoading } = useRequireAuth();
  const [location] = useLocation();

  const greeting = useMemo(() => {
    if (!profile?.name) return "Customer";
    return profile.name.split(" ")[0];
  }, [profile?.name]);

  if (isLoading || !profile) return null;

  return (
    <AppLayout>
      <div className="page-shell bg-background/30 min-h-screen">
        <section className="container-wide section-padding">
          {location === "/dashboard" && (
            <SectionHeading 
              align="left" 
              title={`Hello, ${greeting}`} 
              subtitle="Welcome back" 
            />
          )}
        </section>

        <section className="container-wide pb-24 -mt-4">
          <Switch>
            <Route path="/dashboard" component={DashboardHome} />
            <Route path="/dashboard/orders" component={OrdersList} />
            <Route path="/dashboard/track/:id">{(params) => <OrderTrack id={params.id} />}</Route>
            <Route path="/dashboard/profile" component={ProfilePanel} />
            {/* Redirect any old links */}
            <Route path="/dashboard/wallet">
               {() => { window.location.href = "/dashboard"; return null; }}
            </Route>
            <Route>{location.startsWith("/dashboard") ? <DashboardHome /> : null}</Route>
          </Switch>
        </section>
      </div>
    </AppLayout>
  );
}
