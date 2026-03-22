import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "./ui";
import { useAuth } from "@/hooks/use-auth";
import { 
  Menu, X, Home, List, 
  User, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Package, ArrowUpRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SteamCursor } from "@/components/cursor";

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

  const isHomePage = location === "/";
  const shouldShowBackground = isScrolled || !isHomePage;

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out font-sans",
      shouldShowBackground
        ? "bg-white/95 lg:bg-white/80 lg:backdrop-blur-2xl border-b border-primary/10 py-4 shadow-[0_8px_30px_rgba(11,28,59,0.12)]"
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
                loading="lazy"
                className={cn(
                  "h-10 md:h-11 w-auto transition-all duration-700",
                  !shouldShowBackground && "brightness-0 invert opacity-90"
                )}
              />
            </motion.div>
          </Link>

          {/* Nav Links - Focused/Centered */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1.5 p-1 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(11,28,59,0.08)] z-10 mx-6">
            {navLinks.map((link) => {
              const isActive = location === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] transition-all px-6 py-2.5 rounded-full relative",
                    isActive 
                      ? "text-white" 
                      : shouldShowBackground
                        ? "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                        : "text-white/80 hover:text-white hover:bg-white/10"
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "font-black text-[10px] uppercase tracking-widest p-0 h-auto underline decoration-primary/20 decoration-2 underline-offset-4",
                    shouldShowBackground ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white"
                  )}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "font-black text-[10px] uppercase tracking-widest p-0 h-auto underline decoration-primary/20 decoration-2 underline-offset-4",
                    shouldShowBackground ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white"
                  )}
                >
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/schedule-pickup">
              <Button size="sm" className="h-12 px-8 rounded-2xl shadow-2xl hover:scale-105 transition-all">
                Book Pickup
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              className="p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 shadow-sm text-white lg:hidden z-20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
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
            className="lg:hidden absolute top-[calc(100%+0.5rem)] inset-x-6 rounded-[3rem] border border-white/60 bg-white/95 backdrop-blur-3xl shadow-2xl p-10 z-50 overflow-hidden"
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
    <footer className="bg-[#0B1C3B] text-white pt-40 pb-28 md:pb-24 relative overflow-hidden border-t border-white/10 rounded-t-[4rem]">
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1.2px, transparent 1.2px)', backgroundSize: '48px 48px' }} />
      
      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">

          <div className="lg:col-span-4 space-y-12">
            <Link href="/" className="inline-block group">
              <img
                src={`${import.meta.env.BASE_URL}logo.webp`}
                alt="Fab Clean logo"
                loading="lazy"
                className="h-11 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 text-2xl font-medium leading-relaxed max-w-sm">
              Crafting a state-of-the-art cleaning science for your most cherished garments. 
            </p>
            <div className="flex gap-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -8, scale: 1.1 }}
                  className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-white/80 hover:bg-gold-gradient hover:text-[#0B1C3B] transition-all border border-white/10"
                >
                  <Icon className="w-7 h-7" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[#F4B942] font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Explore</h4>
            <ul className="space-y-6">
              {[
                { label: "Our Services", path: "/services" },
                { label: "Pricing List", path: "/pricing" },
                { label: "Book Pickup", path: "/schedule-pickup" },
                { label: "Tech & Science", path: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.path} className="text-white/70 hover:text-white hover:translate-x-3 transition-all inline-block font-bold text-lg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[#F4B942] font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Get in Touch</h4>
            <div className="space-y-10">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Phone size={24} className="text-[#F4B942]" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1.5">Direct Line</div>
                  <a href="tel:9363059595" className="text-xl font-black text-white hover:text-[#F4B942] transition-colors block leading-none">93630 59595</a>
                </div>
              </div>
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Mail size={24} className="text-[#F4B942]" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1.5">Email Hub</div>
                  <a href="mailto:info@myfabclean.in" className="text-xl font-black text-white hover:text-[#F4B942] transition-colors block leading-none">info@myfabclean.in</a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[#F4B942] font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Pickup Locations</h4>
            <div className="space-y-6">
              {[
                { name: "Pollachi", addr: "Mahalingapuram, Opp Naturals Salon" },
                { name: "Kinathukadavu", addr: "MLA Office Rd, Krishnasampuram" }
              ].map(branch => (
                <div key={branch.name} className="bg-white/10 p-8 rounded-[2rem] border border-white/10">
                   <div className="flex gap-4">
                     <MapPin size={24} className="text-[#F4B942] shrink-0" />
                     <div>
                       <div className="text-lg font-black text-white mb-1">{branch.name}</div>
                       <p className="text-sm text-white/70 leading-relaxed font-medium">{branch.addr}</p>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Fab Clean. High Fashion Preservation.
          </p>
          <div className="flex gap-6 lg:gap-12 flex-wrap justify-center text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
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
    <nav aria-label="Bottom navigation" className="lg:hidden fixed bottom-[88px] inset-x-8 z-50 max-w-md mx-auto left-0 right-0">
      <div className="bg-white/95 backdrop-blur-2xl border border-border/70 rounded-[2.5rem] shadow-[0_20px_50px_rgba(11,28,59,0.18)] overflow-hidden px-6 h-20 flex justify-between items-center">
          {tabs.map((tab) => {
            const isActive = location === tab.path || (tab.path !== "/" && location.startsWith(tab.path));
            return (
              <Link
                key={tab.name}
                href={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-2 transition-all relative",
                  isActive ? "text-primary" : "text-muted-foreground/70 hover:text-primary"
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
    </nav>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = window.location;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden relative isolate">
      <SteamCursor />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 page-backdrop" />
        <div className="absolute inset-0 page-aurora animate-aurora opacity-70" />
        <div className="absolute inset-0 page-fabric opacity-[0.4]" />
      </div>
      <Navbar />
      <main className="flex-1 w-full pt-0 pb-32 lg:pb-0">{children}</main>
      <Footer />
      <a
        href="https://wa.me/919363059595?text=Hi%2C%20I%27d%20like%20to%20book%20a%20laundry%20pickup."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Fab Clean on WhatsApp"
        className="hidden lg:flex fixed right-4 bottom-8 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white items-center justify-center shadow-2xl animate-whatsapp-pulse hover:scale-105 transition-transform"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.527 5.836L.057 23.859l6.204-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.005-1.368l-.359-.214-3.72.869.9-3.61-.235-.375A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818S17.42 21.818 12 21.818z"/>
        </svg>
        <span className="absolute right-full mr-3 px-4 py-2 rounded-full bg-white text-[#0B1C3B] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg opacity-0 tooltip-delay lg:hidden">
          Chat to book
        </span>
      </a>
      <div className="mobile-cta-bar lg:hidden">
        <a href="tel:+919363059595" className="mobile-cta-call">Call</a>
        <a href="https://wa.me/919363059595" className="mobile-cta-wa" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
      <BottomTabBar />
    </div>
  );
}
