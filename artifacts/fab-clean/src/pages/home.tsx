import { Link } from "wouter";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout";
import { Button, SectionHeading, FadeIn, Card } from "@/components/ui";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CheckCircle2, Clock, MapPin, Star,
  Shirt, Briefcase, Zap, ArrowRight, Phone, Sparkles
} from "lucide-react";

const mockServices = [
  { id: "1", name: "Premium Dry Cleaning", short: "Artisan care for suits, sarees, and delicate couture.", icon: Briefcase, price: "₹150" },
  { id: "2", name: "Luxury Laundry", short: "Softened water wash with premium eco-solvents.", icon: Shirt, price: "₹45" },
  { id: "3", name: "Artisanal Shoe SPA", short: "Deep restoration for your premium sneakers and leather.", icon: Zap, price: "₹300" },
  { id: "4", name: "House Linen Care", short: "Medical grade sanitization for your home bedsheets.", icon: CheckCircle2, price: "₹70/kg" },
];

const testimonials = [
  { name: "Ananya Iyer", location: "Mahalingapuram", stars: 5, text: "The quality is outstanding. My wedding silk sarees looked exactly like they did on the first day. Best in Pollachi!" },
  { name: "Vikram Seth", location: "Kinathukadavu", stars: 5, text: "I've tried many services, but Fab Clean's precision with leather jackets and shoes is unmatched. Highly professional." },
  { name: "Suresh Pillai", location: "Pollachi Town", stars: 5, text: "Their 48-hour express delivery saved my business trip. The clothes were perfectly steamed and vacuum packed." },
];

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <AppLayout>

      {/* ─── HERO SECTION ─────────────────────────────────── */}
      {/* Updated with a more robust mobile-first flex layout and increased spacing */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden pt-36 pb-32 lg:pt-56 lg:pb-44">
        {/* Optimized Video Background */}
        <div className="absolute inset-0 z-0">
          {!isMobile ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="w-full h-full object-cover"
              poster={`${import.meta.env.BASE_URL}images/premium-hero.webp`}
            >
              <source src={`${import.meta.env.BASE_URL}home-background.webm`} type="video/webm" />
              <source src={`${import.meta.env.BASE_URL}home-background.mp4`} type="video/mp4" />
            </video>
          ) : (
            <picture>
              <source
                srcSet={`${import.meta.env.BASE_URL}images/premium-hero.webp`}
                type="image/webp"
              />
              <img
                src={`${import.meta.env.BASE_URL}images/premium-hero.png`}
                alt=""
                className="w-full h-full object-cover"
                fetchPriority="high"
                loading="eager"
              />
            </picture>
          )}
          {/* High-End Glassmorphism Overlay - Optimized for maximum legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/85" />
          <div className="absolute inset-0 bg-background/10" />
        </div>

        {/* Static gradient wash to replace animated blur blobs */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 10%, hsla(87,54%,51%,0.12) 0%, transparent 60%)," +
              "radial-gradient(ellipse 50% 40% at 10% 90%, hsla(215,91%,54%,0.10) 0%, transparent 60%)",
          }}
        />
        
        {/* Subtle grid for texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container-wide w-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            
            {/* HERO TEXT (1/2) */}
            <div className="space-y-12 text-center lg:text-left order-2 lg:order-1 mt-12 lg:mt-0 xl:pr-10">
              <FadeIn>
                <div className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-3xl text-white text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Pollachi's Premium Dry Cleaning & Laundry
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                {/* Scaled-down H1 for mobile-first balance */}
                <h1 className="text-[2.6rem] sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-black font-display text-white leading-[1.05] -tracking-tight">
                  Revive Your <br/>
                  <span className="text-gradient drop-shadow-2xl font-serif italic">Wardrobe.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-md">
                  We don't just wash clothes; we preserve them. Pollachi's only scientific artisan dry cleaning with premium eco-solvents.
                </p>
              </FadeIn>

              <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-6 items-center lg:items-start justify-center lg:justify-start pt-8">
                <Link href="/schedule-pickup">
                  <Button size="lg" className="w-full sm:w-auto min-w-[300px] shadow-3xl group transition-all h-24 bg-primary text-primary-foreground hover:scale-105 rounded-[2rem] text-xs font-black">
                    Schedule Free Pickup
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[240px] bg-white/5 border-white/20 text-white/90 h-24 backdrop-blur-md hover:bg-white/10 rounded-[2rem] text-xs font-black">
                    See All Services
                  </Button>
                </Link>
              </FadeIn>

              <FadeIn delay={0.4} className="flex flex-wrap items-center justify-center lg:justify-start gap-12 mt-20 opacity-60">
                {[
                  { icon: MapPin, label: "Free 3km Hub" },
                  { icon: Clock, label: "48h Promised" },
                  { icon: CheckCircle2, label: "Eco-Solvent" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
                    <Icon className="w-6 h-6 text-primary" />
                    {label}
                  </div>
                ))}
              </FadeIn>
            </div>

            {/* HERO VISUAL (1/2) - Optimized and balanced */}
            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <FadeIn delay={0.2} className="relative aspect-[4/5] sm:aspect-[1.1] lg:aspect-[1] group w-full max-w-[500px] xl:max-w-[580px] origin-center">
                {/* Visual breathing room */}
                <div className="absolute -inset-10 bg-primary/10 rounded-full blur-[6rem] group-hover:bg-primary/20 transition-colors duration-[2s] pointer-events-none" />
                
                <div className="absolute inset-0 bg-background border-[10px] sm:border-[16px] border-background/5 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] rounded-[4.5rem] sm:rounded-[5rem] overflow-hidden group-hover:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.5)] transition-all duration-[1s] backdrop-blur-3xl animate-float">
                  <picture>
                    <source
                      srcSet={`${import.meta.env.BASE_URL}images/hero-v2.webp`}
                      type="image/webp"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}images/hero-v2.png`}
                      alt="Premium Laundry Lifestyle"
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 brightness-110 contrast-110"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Floating Metric - Balanced position */}
                <div
                  className="absolute -bottom-10 -left-6 lg:-left-20 bg-white/92 backdrop-blur-2xl shadow-4xl rounded-[2.5rem] p-8 border border-white/50 flex items-center gap-6 z-20 hover:scale-105 transition-transform cursor-pointer"
                  style={{ animation: "float-badge 6s ease-in-out infinite", willChange: "transform" }}
                >
                  <div className="w-14 h-14 rounded-[1.2rem] bg-lime-gradient flex items-center justify-center shadow-lg shadow-primary/30">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-black tracking-[0.4em] text-muted-foreground/60 mb-1 leading-none">Delivered</div>
                    <div className="text-3xl font-black text-foreground tabular-nums tracking-tighter leading-none">50,000<span className="text-primary text-xs ml-0.5">+</span></div>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─────────────────────────────────── */}
      <section className="py-32 bg-card border-y border-border/10 relative z-20">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-32">
            {[
              { val: "2,000+", label: "Clothes Weekly" },
              { val: "2", label: "Smart Hubs" },
              { val: "100%", label: "Eco-Friendly" },
              { val: "48h", label: "Guaranteed Turn" },
            ].map((m, i) => (
              <FadeIn key={i} delay={0.1 * i} className="text-center group">
                <div className="text-5xl md:text-6xl lg:text-7xl font-black font-display text-foreground mb-4 group-hover:text-primary transition-colors tracking-tighter tabular-nums">{m.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40">{m.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARTISAN SERVICES ────────────────────────────── */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <SectionHeading
            title="Professional Care Science"
            subtitle="The Artisan Ensemble"
            className="mb-32"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {mockServices.map((s, i) => (
              <FadeIn key={s.id} delay={0.1 * i}>
                <Card className="p-12 h-full flex flex-col group bg-background shadow-2xl shadow-black/[0.02] rounded-[4rem] border-transparent hover:border-border/50 transition-all hover:-translate-y-2 duration-500">
                  <div className="w-24 h-24 rounded-[2rem] bg-muted/30 flex items-center justify-center text-foreground mb-12 group-hover:bg-lime-gradient group-hover:text-white transition-all duration-700 shadow-sm border border-border/30">
                    <s.icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black font-display text-foreground mb-6 leading-tight group-hover:text-primary transition-colors tracking-tight">{s.name}</h3>
                  <p className="text-muted-foreground text-xl mb-12 flex-grow leading-relaxed font-medium">{s.short}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-10 border-t border-black/5">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">Starts {s.price}</span>
                    <div className="w-14 h-14 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-white transition-all duration-500">
                      <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE PIPELINE ───────────────────────────────── */}
      <section className="section-padding relative overflow-hidden bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1240px] border-[100px] border-primary/[0.012] rounded-full pointer-events-none" />
        
        <div className="container-wide relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-10">
            <div className="max-w-xl text-center md:text-left">
              <SectionHeading
                title="The Fab Clean Blueprint"
                subtitle="High-Tech Pipeline"
                align="left"
              />
            </div>
            <p className="text-muted-foreground text-xl leading-relaxed font-medium max-w-sm mb-4 text-center md:text-left">
              Every garment undergoes a 6-stage scientific restoration process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 lg:gap-32">
            {[
              { n: "01", t: "Assessment", d: "Microscopic inspection of fibers and hidden stain analysis." },
              { n: "02", t: "Sorting", d: "Segregation based on PH balance and fabric weight." },
              { n: "03", t: "Spotting", d: "Targeted organic treatment for stubborn old stains." },
              { n: "04", t: "Restoration", d: "Miele technology paired with premium eco-solvents." },
              { n: "05", t: "Final Press", d: "Precision steam ironing for factory-original fit." },
              { n: "06", t: "Sanitation", d: "UVC-safe packaging ensuring clinical garment hygiene." },
            ].map((step, i) => (
              <FadeIn key={step.n} delay={0.1 * i} className="relative group text-center md:text-left">
                <span className="text-[120px] font-black font-display text-primary/[0.05] absolute -top-16 -left-6 lg:-left-10 transition-colors group-hover:text-primary/[0.1] leading-none -z-10">{step.n}</span>
                <div className="pt-12 px-6 md:px-0">
                  <h4 className="text-3xl font-black text-foreground mb-6 group-hover:translate-x-4 transition-transform tracking-tight">{step.t}</h4>
                  <p className="text-xl text-muted-foreground leading-relaxed font-medium">{step.d}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────── */}
      <section className="section-padding bg-muted/30 overflow-hidden">
        <div className="container-wide relative">
          <SectionHeading
            title="The Prime Community"
            subtitle="Voices of Excellence"
            className="mb-32"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <Card className="p-12 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all h-full flex flex-col bg-background rounded-[4rem]">
                  <div className="flex mb-10 gap-1.5 underline decoration-primary decoration-4 underline-offset-8">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-foreground text-2xl leading-[1.4] mb-12 font-serif italic pr-4">"{t.text}"</p>
                  <div className="flex items-center gap-5 mt-auto">
                    <div className="w-14 h-14 rounded-2xl bg-foreground text-white flex items-center justify-center font-black text-xl shadow-xl shadow-foreground/20">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground leading-none mb-1.5">{t.name}</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{t.location}</div>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────── */}
      <section className="py-32 px-6 md:px-20 mb-20 bg-background relative overflow-hidden">
        <div className="container-wide">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative rounded-[5rem] overflow-hidden bg-white/90 p-16 md:p-32 text-center text-foreground border border-border shadow-3xl shadow-black/10 group"
          >
            {/* Texture/Bloom */}
            <div className="absolute inset-0 bg-premium-mesh opacity-10 pointer-events-none" />
            
            <div className="relative z-10 space-y-12 max-w-4xl mx-auto">
              <h2 className="text-[2.6rem] md:text-[5rem] lg:text-[6.5rem] font-black font-display leading-[1] mb-8">
                The Luxury of <br/>
                <span className="text-primary italic font-serif tracking-normal">Extra Time.</span>
              </h2>
              <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                Join 1,200+ premium households in Pollachi who've upgraded their life with Fab Clean.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-10">
                <Link href="/schedule-pickup">
                  <Button size="lg" className="h-24 px-20 text-xs font-black shadow-3xl hover:scale-110 active:scale-95 transition-all w-full sm:w-auto">
                    Schedule Pickup
                  </Button>
                </Link>
                <a href="tel:+919363059595">
                  <Button size="lg" variant="outline" className="h-24 px-16 border-primary/20 text-foreground hover:bg-[#D6EBF7]/60 hover:border-primary/40 text-xs font-black w-full sm:w-auto">
                    <Phone className="mr-3 w-5 h-5 text-primary/70" />
                    Talk to Us
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </AppLayout>
  );
}
