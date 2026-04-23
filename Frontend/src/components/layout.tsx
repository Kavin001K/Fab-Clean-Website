import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Pricing", path: "/pricing" },
  { name: "Track Order", path: "/track-order" },
  { name: "Reviews", path: "/reviews" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function isActivePath(location: string, path: string) {
  return location === path || (path !== "/" && location.startsWith(path));
}

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-[max(12px,env(safe-area-inset-top))] sm:px-6">
      <div className="container-wide">
        <div
          className={cn(
            "mx-auto flex max-w-[1160px] items-center justify-between rounded-full border px-4 py-3 transition-all sm:px-5",
            isScrolled
              ? "border-white/50 bg-white/90 shadow-[0_20px_60px_-30px_rgba(8,145,178,0.2)] backdrop-blur-xl"
              : "border-white/50 bg-white/80 shadow-[0_10px_40px_-20px_rgba(8,145,178,0.15)] backdrop-blur-xl",
          )}
        >
          <Link href="/" className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logo.webp`}
              alt="Fab Clean logo"
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((item) => {
              const active = isActivePath(location, item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "rounded-full px-4 py-2 text-[12px] font-bold transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href={isAuthenticated ? "/dashboard/orders" : "/login"}>
              <Button variant="ghost" size="sm">
                {isAuthenticated ? "Dashboard" : "Sign In"}
              </Button>
            </Link>
            <Link href="/schedule-pickup">
              <Button size="sm">Book Pickup</Button>
            </Link>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary/10 bg-white/80 text-foreground shadow-sm backdrop-blur-sm lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="container-wide mt-3 lg:hidden"
          >
            <div className="surface-card max-w-[1160px] p-4">
              <div className="grid gap-2">
                {NAV_LINKS.map((item) => {
                  const active = isActivePath(location, item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold",
                        active ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted",
                      )}
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link href={isAuthenticated ? "/dashboard/orders" : "/login"}>
                  <Button variant="outline" className="w-full">
                    {isAuthenticated ? "Open Dashboard" : "Customer Sign In"}
                  </Button>
                </Link>
                <Link href="/schedule-pickup">
                  <Button className="w-full">Book Pickup</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/50 bg-white/60 backdrop-blur-sm">
      <div className="container-wide py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1fr]">
          <div className="space-y-5">
            <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Fab Clean logo" className="h-9 w-auto" />
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              Reliable garment care for daily wear, occasion wear, shoes, and household linen. Pickup, tracking, and support are all available from one simple website.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="info-chip">Pickup in Pollachi</span>
              <span className="info-chip">Live order tracking</span>
              <span className="info-chip">Customer feedback reviewed</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-black text-foreground">Quick links</p>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <Link href="/services" className="hover:text-primary">Services</Link>
              <Link href="/pricing" className="hover:text-primary">Pricing</Link>
              <Link href="/track-order" className="hover:text-primary">Track order</Link>
              <Link href="/reviews" className="hover:text-primary">Reviews</Link>
              <Link href="/schedule-pickup" className="hover:text-primary">Schedule pickup</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-black text-foreground">Support</p>
            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <a href="tel:+919363059595" className="block hover:text-primary">93630 59595</a>
                  <a href="tel:+919363719595" className="block hover:text-primary">93637 19595</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <a href="mailto:info@myfabclean.in" className="block hover:text-primary">info@myfabclean.in</a>
                  <span>Mon to Sat, 10:00 AM to 8:00 PM</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                <span>Pickup service available across Pollachi and nearby areas.</span>
              </div>
            </div>
          </div>

          <div className="surface-soft p-5">
            <p className="text-sm font-black text-foreground">Need help fast?</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Use WhatsApp for pickup requests, delivery questions, or urgent order help.
            </p>
            <div className="mt-5 grid gap-3">
              <a href="https://wa.me/919363059595?text=Hi%2C%20I%20need%20help%20with%20my%20Fab%20Clean%20order." target="_blank" rel="noreferrer">
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
              <div className="flex items-start gap-3 rounded-2xl bg-primary/10 px-4 py-3 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                <span>Phone OTP login and customer data access stay limited to the signed-in customer scope.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border/80 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Fab Clean. Clear service, careful handling, and live tracking.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
            <Link href="/refund" className="hover:text-primary">Refund</Link>
            <Link href="/cookies" className="hover:text-primary">Cookies</Link>
            <Link href="/sitemap" className="hover:text-primary">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 page-backdrop" />
      <div className="pointer-events-none fixed inset-0 -z-10 page-fabric opacity-30" />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative z-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <a
        href="https://wa.me/919363059595?text=Hi%2C%20I%27d%20like%20to%20book%20a%20Fab%20Clean%20pickup."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Fab Clean on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_20px_40px_-22px_rgba(37,211,102,0.72)] transition-transform hover:scale-105 animate-whatsapp-pulse backdrop-blur-sm"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
