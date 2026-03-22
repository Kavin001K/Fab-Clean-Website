import { Switch, Route, Link, useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import { useRequireAuth } from "@/hooks/use-auth";
import { Card, Button, Badge, FadeIn } from "@/components/ui";
import { useListOrders, useGetOrder } from "@workspace/api-client-react";
import { Package, User, LogOut, Loader2, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  
  const links = [
    { name: "My Orders", path: "/dashboard/orders", icon: Package },
    { name: "Profile Settings", path: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="w-full md:w-64 space-y-2">
      {links.map(l => (
        <Link 
          key={l.path} 
          href={l.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.startsWith(l.path) || (location === '/dashboard' && l.path === '/dashboard/orders') ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary hover:text-white'}`}
        >
          <l.icon className="w-5 h-5" />
          {l.name}
        </Link>
      ))}
      <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-colors mt-8">
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}

function OrdersList() {
  const { data, isLoading } = useListOrders();

  if (isLoading) return <div className="flex p-12 justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data?.data?.length) return <div className="p-12 text-center text-muted-foreground bg-card rounded-2xl border border-white/5">No orders found. <Link href="/schedule-pickup" className="text-primary hover:underline ml-2">Schedule one now.</Link></div>;

  return (
    <div className="space-y-4">
      {data.data.map((order, i) => (
        <FadeIn key={order.id} delay={i * 0.05}>
          <Link href={`/dashboard/track/${order.id}`}>
            <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono font-bold text-white text-lg">{order.reference}</span>
                  <Badge variant={order.status === 'delivered' ? 'outline' : 'default'} className={order.status === 'delivered' ? 'text-green-400 border-green-400/30' : ''}>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                  <p className="text-lg font-bold text-white">{order.totalAmount ? `₹${order.totalAmount}` : 'Pending'}</p>
                </div>
                <Button variant="outline" className="shrink-0 group-hover:bg-primary group-hover:text-white group-hover:border-primary">Track</Button>
              </div>
            </Card>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}

function OrderTrack({ id }: { id: string }) {
  const { data, isLoading } = useGetOrder(id);
  
  if (isLoading) return <div className="flex p-12 justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data?.data) return <div>Order not found.</div>;

  const order = data.data;
  const stages = ['received', 'sorting', 'cleaning', 'quality_check', 'ready', 'out_for_delivery', 'delivered'];
  const currentIndex = stages.indexOf(order.status);

  return (
    <Card className="p-8">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Order {order.reference}</h2>
          <p className="text-muted-foreground">Branch: <span className="capitalize text-white">{order.branch}</span></p>
        </div>
        <Badge className="text-lg py-2 px-4">{order.status.replace(/_/g, ' ')}</Badge>
      </div>

      <div className="relative pl-6 md:pl-0">
        <div className="absolute left-[27px] md:left-0 md:top-6 bottom-0 md:bottom-auto md:right-0 w-0.5 md:w-full md:h-0.5 bg-secondary -z-10" />
        
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={stage} className="relative flex md:flex-col items-center gap-4 md:gap-3 text-center w-full">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-card transition-colors z-10 ${isCompleted ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <div className="text-left md:text-center">
                  <p className={`font-semibold capitalize text-sm md:text-xs lg:text-sm ${isCurrent ? 'text-primary' : isCompleted ? 'text-white' : 'text-muted-foreground'}`}>
                    {stage.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { profile, isLoading } = useRequireAuth();
  const [location] = useLocation();

  if (isLoading || !profile) return null; // handled by hook

  return (
    <AppLayout>
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-2">Hello, {profile.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-muted-foreground text-lg">Manage your orders and profile preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <Sidebar />
          <div className="flex-1 w-full">
            <Switch>
              <Route path="/dashboard" component={OrdersList} />
              <Route path="/dashboard/orders" component={OrdersList} />
              <Route path="/dashboard/track/:id">
                {params => <OrderTrack id={params.id} />}
              </Route>
              <Route path="/dashboard/profile">
                <Card className="p-8"><p className="text-white">Profile settings coming soon.</p></Card>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
