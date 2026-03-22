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
    <header className="fixed top-2.5 md:top-6 inset-x-0 z-50 pointer-events-none px-4 md:px-8 pt-[env(safe-area-inset-top)]">
      <div className="flex justify-center mx-auto pointer-events-auto w-full">
        <div className={cn(
          "navbar",
          shouldShowBackground && "scrolled"
        )}>
          {/* Left Section: Logo */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="inline-block group transition-all duration-300 hover:scale-105">
              <img
                src={`${import.meta.env.BASE_URL}logo.webp`}
                alt="Fab Clean logo"
                className="h-[26px] w-auto opacity-95 transition-all duration-300 logo-img"
              />
            </Link>
          </div>

          {/* Center Section: Nav Links (Pill Style) */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center nav-menu px-1 py-1">
            <div className="relative flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={cn(
                      "nav-item text-[10px] font-black uppercase tracking-[0.2em] transition-all px-6 py-2.5 rounded-full relative liquid-glass-highlight",
                      isActive ? "text-white" : "text-white/70 hover:text-white"
                    )}
                  >
                    <motion.span 
                      className="relative z-20 flex items-center justify-center"
                      whileHover={{ scale: 1.1, x: 2, y: -1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {link.name}
                    </motion.span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-liquid-indicator"
                        className="nav-indicator absolute inset-0 w-full h-full"
                        transition={{ 
                          type: "spring", 
                          stiffness: 350, 
                          damping: 30,
                          mass: 0.8
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right Section: Actions */}
          <div className="flex-1 flex items-center justify-end gap-6">
            <Link 
              href={isAuthenticated ? "/dashboard" : "/login"}
              className={cn(
                "hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                shouldShowBackground ? "text-slate-900" : "text-white/70 hover:text-white"
              )}
            >
              {isAuthenticated ? "Dashboard" : "Sign In"}
            </Link>
            
            <Link href="/schedule-pickup" className="hidden lg:block">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                Book Pickup
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                className="menu-toggle p-4 z-20 active:scale-90 flex items-center justify-center text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="menu-panel md:hidden"
          >
            <div className="flex flex-col gap-2">
              <button
                className="menu-toggle self-end mb-4 text-black"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col gap-1 relative z-10">
                {navLinks.map((link) => {
                  const isActive = location === link.path;
                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-6 py-4 rounded-2xl text-xl font-bold font-display transition-all flex items-center justify-between group touch-action-manipulation select-none active:scale-95",
                        isActive ? "bg-primary/5 text-primary" : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      <motion.div 
                        className="flex items-center justify-between w-full"
                        whileTap={{ scale: 0.98 }}
                      >
                        {link.name}
                        <ArrowUpRight className={cn("w-6 h-6 transition-all", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                      </motion.div>
                    </Link>
                  );
                })}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0B1C3B] text-white pt-40 pb-28 relative overflow-hidden border-t border-white/5 rounded-t-[4rem]">
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
    <div className="min-h-screen flex flex-col bg-transparent font-sans overflow-x-hidden relative isolate">
      <SteamCursor />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-transparent" />
        <div className="absolute inset-0 page-fabric opacity-[0.2]" />
      </div>
      <Navbar />
      <main className="flex-1 w-full pt-16 lg:pt-0">{children}</main>
      <Footer />
      <a
        href="https://wa.me/919363059595?text=Hi%2C%20I%27d%20like%20to%20book%20a%20laundry%20pickup."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Fab Clean on WhatsApp"
        className="fixed right-6 bottom-8 z-50 w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl animate-whatsapp-pulse hover:scale-110 active:scale-95 transition-all"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.527 5.836L.057 23.859l6.204-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.005-1.368l-.359-.214-3.72.869.9-3.61-.235-.375A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818S17.42 21.818 12 21.818z"/>
        </svg>
      </a>
    </div>
  );
}
