import { Switch, Route, Link, useLocation } from "wouter";
import { useGetOrder, useListOrders } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout";
import { useRequireAuth } from "@/hooks/use-auth";
import { Card, Button, Badge, FadeIn } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import {
  buildTrackingSteps,
  getOrderStatusLabel,
  getOrderStatusTone,
} from "@/lib/customer-experience";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  LogOut,
  Package,
  Phone,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { cn, formatCurrency } from "@/lib/utils";

function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const links = [
    { name: "My Orders", path: "/dashboard/orders", icon: Package },
    { name: "Profile Settings", path: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="w-full md:w-64 space-y-2">
      {links.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            location.startsWith(link.path) || (location === "/dashboard" && link.path === "/dashboard/orders")
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-secondary hover:text-white"
          }`}
        >
          <link.icon className="w-5 h-5" />
          {link.name}
        </Link>
      ))}
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-colors mt-8"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}

function OrdersList() {
  const ordersQuery = useListOrders({
    query: {
      retry: false,
    } as any,
  });

  if (ordersQuery.isLoading) {
    return (
      <div className="flex p-12 justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const orders = ordersQuery.data?.data || [];

  if (!orders.length) {
    return (
      <div className="p-12 text-center text-muted-foreground bg-card rounded-2xl border border-white/5">
        No orders found.
        <Link href="/schedule-pickup" className="text-primary hover:underline ml-2">
          Schedule one now.
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <FadeIn key={order.id} delay={index * 0.04}>
          <Link href={`/dashboard/track/${order.id}`}>
            <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-mono font-bold text-white text-lg">{order.orderNumber}</span>
                  <Badge className={cn("border", getOrderStatusTone(order.status))}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "MMM dd, yyyy")} • {order.branch}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {order.services.slice(0, 2).join(", ") || "Laundry Service"}
                </p>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(order.totalAmount || 0)}</p>
                </div>
                <Button variant="outline" className="shrink-0 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                  Track
                </Button>
              </div>
            </Card>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}

function OrderTrack({ id }: { id: string }) {
  const orderQuery = useGetOrder(id, {
    query: {
      enabled: Boolean(id),
      retry: false,
    } as any,
  });

  if (orderQuery.isLoading) {
    return (
      <div className="flex p-12 justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const order = orderQuery.data?.data;

  if (!order) {
    return <div>Order not found.</div>;
  }

  const steps = buildTrackingSteps(order);

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-primary/10 text-primary border border-primary/15">
                {order.orderNumber}
              </Badge>
              <Badge className={cn("border", getOrderStatusTone(order.status))}>
                {getOrderStatusLabel(order.status)}
              </Badge>
            </div>
            <h2 className="mt-5 text-3xl font-bold text-white">Order progress</h2>
            <p className="mt-2 text-muted-foreground">
              {order.branch} • {order.fulfillmentType} • Updated{" "}
              {format(new Date(order.updatedAt || order.createdAt), "MMM dd, yyyy hh:mm a")}
            </p>
          </div>

          <Link href={`/trackorder/${encodeURIComponent(order.orderNumber)}`}>
            <Button variant="outline">
              Open Public Tracker
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.key}
              className={cn(
                "rounded-[1.8rem] border px-4 py-5",
                step.current
                  ? "border-primary/30 bg-primary/8"
                  : step.completed
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "border-border bg-muted/20"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-bold text-foreground">{step.label}</div>
                {step.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : null}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {step.current ? "Current stage" : step.completed ? "Completed" : "Upcoming"}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-white">Order details</h3>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <div className="flex justify-between gap-4">
              <span>Customer</span>
              <span className="text-white font-semibold">{order.customerName || "Fab Clean Customer"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Payment Status</span>
              <span className="text-white font-semibold capitalize">
                {order.paymentStatus.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Total</span>
              <span className="text-white font-semibold">{formatCurrency(order.totalAmount || 0)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Pickup Date</span>
              <span className="text-white font-semibold">
                {order.pickupDate ? format(new Date(order.pickupDate), "MMM dd, yyyy") : "TBD"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Contact</span>
              <span className="text-white font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {order.customerPhone || "Unavailable"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>WhatsApp Status</span>
              <span className="text-white font-semibold capitalize">
                {order.lastWhatsappStatus ? order.lastWhatsappStatus.replace(/_/g, " ") : "Not available"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {order.invoiceUrl ? (
              <Button
                variant="outline"
                onClick={() => window.open(order.invoiceUrl!, "_blank", "noopener,noreferrer")}
              >
                Open Invoice
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            ) : null}
            <Link href={`/feedback?orderId=${encodeURIComponent(order.id)}`}>
              <Button variant="outline">Update Feedback</Button>
            </Link>
          </div>

          {order.feedbackSubmittedAt ? (
            <div className="mt-6 rounded-[1.6rem] border border-emerald-200 bg-emerald-50/70 px-4 py-4 text-sm text-emerald-800">
              Feedback saved on {format(new Date(order.feedbackSubmittedAt), "MMM dd, yyyy hh:mm a")}
              {order.customerRating ? ` • ${order.customerRating}/5 stars` : ""}
              {order.feedbackComment ? ` • ${order.feedbackComment}` : ""}
            </div>
          ) : null}
        </Card>

        <Card className="p-8">
          <h3 className="text-2xl font-bold text-white">Service items</h3>
          <div className="mt-6 space-y-4">
            {order.items.map((item, index) => (
              <div
                key={`${item.serviceName}-${index}`}
                className="flex items-center justify-between rounded-[1.6rem] bg-muted/20 px-4 py-4"
              >
                <div>
                  <div className="font-bold text-white">{item.serviceName}</div>
                  <div className="text-sm text-muted-foreground">Quantity {item.quantity}</div>
                </div>
                <div className="font-bold text-white">{formatCurrency(item.price || 0)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { profile, isLoading } = useRequireAuth();

  if (isLoading || !profile) return null;

  return (
    <AppLayout>
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Hello, {profile.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your orders and profile preferences.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <Sidebar />
          <div className="flex-1 w-full">
            <Switch>
              <Route path="/dashboard" component={OrdersList} />
              <Route path="/dashboard/orders" component={OrdersList} />
              <Route path="/dashboard/track/:id">
                {(params) => <OrderTrack id={params.id} />}
              </Route>
              <Route path="/dashboard/profile">
                <Card className="p-8">
                  <p className="text-white">Profile settings coming soon.</p>
                </Card>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
