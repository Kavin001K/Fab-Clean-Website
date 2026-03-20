import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "./ui";
import { useAuth } from "@/hooks/use-auth";
import { 
  Menu, X, Home, List, Calendar, 
  User, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Package
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
      isScrolled
        ? "bg-white/95 backdrop-blur-xl border-border shadow-sm py-3"
        : "bg-white border-border py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          <Link href="/" className="flex items-center group">
            <img
              src={`${import.meta.env.BASE_URL}logo.webp`}
              alt="Fab Clean logo"
              className="h-12 w-auto group-hover:opacity-90 transition-opacity"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-2",
                  location === link.path ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {link.name}
                {location === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-foreground">Sign In</Button>
              </Link>
            )}
            <Link href="/schedule-pickup">
              <Button size="sm" className="bg-lime-gradient text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/40 hover:opacity-90">
                Schedule Pickup
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-white"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium",
                    location === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              {isAuthenticated ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">Sign In</Button>
                </Link>
              )}
              <Link href="/schedule-pickup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mt-2 bg-lime-gradient text-primary-foreground">Schedule Pickup</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal pt-16 pb-20 md:pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          <div className="space-y-5">
            <Link href="/" className="flex items-center">
              <img
                src={`${import.meta.env.BASE_URL}logo.webp`}
                alt="Fab Clean logo"
                className="h-10 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Your clothes deserve the best care — We deliver it. Premium dry cleaning and laundry services in Pollachi & Kinathukadavu.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", path: "/about" },
                { label: "Our Services", path: "/services" },
                { label: "Pricing", path: "/pricing" },
                { label: "Schedule Pickup", path: "/schedule-pickup" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.path} className="text-white/60 hover:text-primary transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Pollachi: <a href="tel:9363059595" className="hover:text-primary transition-colors">93630 59595</a><br />
                  Kinathukadavu: <a href="tel:9363719595" className="hover:text-primary transition-colors">93637 19595</a>
                </span>
              </li>
              <li className="flex gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <a href="mailto:info@myfabclean.in" className="hover:text-primary transition-colors">info@myfabclean.in</a>
              </li>
              <li className="flex gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Mon–Sat: 10AM – 8PM<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Our Branches</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <span className="text-white font-medium block mb-0.5">Pollachi</span>
                  #16, Venkatramana Round Road, Opp Naturals/HDFC Bank, Mahalingapuram – 642002
                </span>
              </li>
              <li className="flex gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <span className="text-white font-medium block mb-0.5">Kinathukadavu</span>
                  #442/11, Opp MLA Office, Krishnasamypuram – 642109
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} Fab Clean | Yadvik Traders. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function BottomTabBar() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  const tabs = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Services", icon: List, path: "/services" },
    { name: "Pickup", icon: Package, path: "/schedule-pickup" },
    { name: isAuthenticated ? "Orders" : "Login", icon: isAuthenticated ? Calendar : User, path: isAuthenticated ? "/dashboard/orders" : "/login" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border pb-safe z-50 shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location === tab.path || (tab.path !== "/" && location.startsWith(tab.path));
          return (
            <Link
              key={tab.name}
              href={tab.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("w-5 h-5", isActive && "stroke-primary")} />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <BottomTabBar />
    </div>
  );
}
