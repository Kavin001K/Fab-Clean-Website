import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Menu, X } from "lucide-react";
import { BRAND, BRANCHES } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Pricing", path: "/pricing" },
  { name: "Reviews", path: "/reviews" },
  { name: "Track Order", path: "/track-order" },
  { name: "Contact", path: "/contact" },
];

function isActivePath(location: string, path: string) {
  return location === path || (path !== "/" && location.startsWith(path));
}

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={cn(
          "mx-auto max-w-[1320px] rounded-full border px-4 py-3 transition-all sm:px-6",
          isScrolled
            ? "border-line bg-panel/88 shadow-[0_18px_45px_rgba(23,20,18,0.08)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" data-cursor-label="Home">
            <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Fab Clean" className="h-9 w-auto" />
            <div className="hidden sm:block">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Premium care</p>
              <p className="font-medium text-ink">{BRAND.name}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((item) => {
              const active = isActivePath(location, item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-ink",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/track-order" data-cursor-label="Track">
              <Button variant="outline" size="sm">Track Order</Button>
            </Link>
            <Link href="/schedule-pickup" data-cursor-label="Book">
              <Button size="sm">Book Pickup</Button>
            </Link>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-4 rounded-[1.75rem] border border-line bg-panel p-4 lg:hidden"
            >
              <div className="grid gap-2">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "rounded-[1.2rem] px-4 py-3 text-sm",
                      isActivePath(location, item.path) ? "bg-primary/10 text-primary" : "text-ink",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Link href="/track-order">
                  <Button variant="outline" className="w-full">Track Order</Button>
                </Link>
                <Link href="/schedule-pickup">
                  <Button className="w-full">Book Pickup</Button>
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-deep text-white">
      <div className="container-wide py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Fab Clean" className="h-10 w-auto" />
            <p className="mt-5 max-w-lg text-base leading-8 text-white/68">{BRAND.shortBlurb}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={BRAND.phoneHref}><Button size="sm">{BRAND.phoneMain}</Button></a>
              <a href={BRAND.whatsappHref} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline" className="border-white/16 bg-white/8 text-white hover:bg-white/14">
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">Explore</p>
            <div className="mt-5 grid gap-3 text-sm text-white/72">
              {NAV_LINKS.map((item) => (
                <Link key={item.path} href={item.path} className="hover:text-white">{item.name}</Link>
              ))}
              <Link href="/schedule-pickup" className="hover:text-white">Schedule Pickup</Link>
              <Link href="/dashboard/orders" className="hover:text-white">Customer Portal</Link>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">Branches</p>
            <div className="mt-5 space-y-5">
              {BRANCHES.map((branch) => (
                <div key={branch.slug}>
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="h-4 w-4 text-primary-light" />
                    <p className="font-medium">{branch.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/60">{branch.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/refund" className="hover:text-white">Refund</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="site-frame min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
