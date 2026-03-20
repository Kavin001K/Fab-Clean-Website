import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "./ui";
import { useAuth } from "@/hooks/use-auth";
import { 
  Menu, X, Home, List, 
  User, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Package, ArrowUpRight,
  Sun, Moon
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/5 hover:bg-primary/10 transition-all"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-in-out font-sans",
      isScrolled
        ? "bg-white/80 dark:bg-black/60 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 py-4"
        : "bg-transparent py-8"
    )}>
      {/* Constrained navbar to match content width for alignment */}
      <div className="container-wide">
        <div className="flex items-center justify-between">

          {/* Logo - Aligned with the start of content */}
          <Link href="/" className="flex items-center group relative overflow-hidden z-20 shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <img
                src={`${import.meta.env.BASE_URL}logo.webp`}
                alt="Fab Clean logo"
                className="h-10 md:h-11 w-auto"
              />
            </motion.div>
          </Link>

          {/* Nav Links - Focused/Centered */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-xl shadow-black/[0.03] z-10 mx-6">
            {navLinks.map((link) => {
              const isActive = location === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] transition-all px-6 py-2.5 rounded-full relative",
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                  )}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-lime-gradient rounded-full shadow-lg shadow-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Tools - Constrained to gutters */}
          <div className="hidden lg:flex items-center gap-6 z-20 shrink-0">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary p-0 h-auto underline decoration-primary/20 decoration-2 underline-offset-4">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary p-0 h-auto underline decoration-primary/20 decoration-2 underline-offset-4">Sign In</Button>
              </Link>
            )}
            <Link href="/schedule-pickup">
              <Button size="sm" className="h-12 px-8 rounded-2xl shadow-2xl hover:scale-105 transition-all">
                Book Pickup
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              className="p-3 text-foreground bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/5 z-20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="lg:hidden absolute top-[calc(100%+0.5rem)] inset-x-6 rounded-[3rem] border border-black/5 dark:border-white/5 bg-white dark:bg-black/90 backdrop-blur-3xl shadow-2xl p-10 z-50 overflow-hidden"
          >
            <div className="flex flex-col gap-3 relative z-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-8 py-5 rounded-[2rem] text-3xl font-black font-display transition-all flex items-center justify-between group",
                    location === link.path ? "bg-primary/5 text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                  <ArrowUpRight className={cn("w-6 h-6 transition-all", location === link.path ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                </Link>
              ))}
              <div className="h-px bg-black/5 my-6 mx-4" />
              <div className="grid grid-cols-2 gap-4">
                <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-[2rem] h-20 text-xs font-black">
                    {isAuthenticated ? "Dashboard" : "Account"}
                  </Button>
                </Link>
                <Link href="/schedule-pickup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-[2rem] h-20 text-xs font-black">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#050505] text-white pt-44 pb-32 md:pb-24 relative overflow-hidden rounded-t-[5rem]">
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
      
      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">

          <div className="lg:col-span-4 space-y-12">
            <Link href="/" className="inline-block group">
              <img
                src={`${import.meta.env.BASE_URL}logo.webp`}
                alt="Fab Clean logo"
                className="h-11 w-auto brightness-0 invert opacity-100"
              />
            </Link>
            <p className="text-white/40 text-2xl font-medium leading-relaxed max-w-sm">
              Crafting a state-of-the-art cleaning science for your most cherished garments. 
            </p>
            <div className="flex gap-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -8, scale: 1.1 }}
                  className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/30 hover:bg-lime-gradient hover:text-primary-foreground transition-all border border-white/5"
                >
                  <Icon className="w-7 h-7" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-primary font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Explore</h4>
            <ul className="space-y-6">
              {[
                { label: "Our Services", path: "/services" },
                { label: "Pricing List", path: "/pricing" },
                { label: "Book Pickup", path: "/schedule-pickup" },
                { label: "Tech & Science", path: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.path} className="text-white/40 hover:text-white hover:translate-x-3 transition-all inline-block font-bold text-lg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-primary font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Get in Touch</h4>
            <div className="space-y-10">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Phone size={24} className="text-primary" />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1.5">Direct Line</div>
                  <a href="tel:9363059595" className="text-xl font-black text-white hover:text-primary transition-colors block leading-none">93630 59595</a>
                </div>
              </div>
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Mail size={24} className="text-primary" />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1.5">Email Hub</div>
                  <a href="mailto:info@myfabclean.in" className="text-xl font-black text-white hover:text-primary transition-colors block leading-none">info@myfabclean.in</a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-primary font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Artisan Hubs</h4>
            <div className="space-y-6">
              {[
                { name: "Pollachi", addr: "Mahalingapuram, Opp Naturals Salon" },
                { name: "Kinathukadavu", addr: "MLA Office Rd, Krishnasampuram" }
              ].map(branch => (
                <div key={branch.name} className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/5">
                   <div className="flex gap-4">
                     <MapPin size={24} className="text-primary shrink-0" />
                     <div>
                       <div className="text-lg font-black text-white mb-1">{branch.name}</div>
                       <p className="text-sm text-white/40 leading-relaxed font-medium">{branch.addr}</p>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Fab Clean. High Fashion Preservation.
          </p>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Legal</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
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
    { name: "Care", icon: List, path: "/services" },
    { name: "Pickup", icon: Package, path: "/schedule-pickup" },
    { name: "Me", icon: User, path: isAuthenticated ? "/dashboard" : "/login" },
  ];

  return (
    <div className="lg:hidden fixed bottom-10 inset-x-8 z-50">
      <div className="bg-black/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden px-6 h-20 flex justify-between items-center">
          {tabs.map((tab) => {
            const isActive = location === tab.path || (tab.path !== "/" && location.startsWith(tab.path));
            return (
              <Link
                key={tab.name}
                href={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-2 transition-all relative",
                  isActive ? "text-primary" : "text-white/30"
                )}
              >
                <div className="relative">
                  <tab.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                  {isActive && (
                    <motion.div
                      layoutId="tab-active"
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(180,197,36,0.8)]"
                    />
                  )}
                </div>
                <span className={cn("text-[8px] font-black uppercase tracking-[0.2em] opacity-60")}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = window.location;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full pt-0">{children}</main>
      <Footer />
      <BottomTabBar />
    </div>
  );
}
