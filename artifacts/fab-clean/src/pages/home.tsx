import { Link } from "wouter";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout";
import { Button, SectionHeading, FadeIn, Card } from "@/components/ui";
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
  return (
    <AppLayout>

      {/* ─── HERO SECTION ─────────────────────────────────── */}
      {/* Updated with a more robust mobile-first flex layout and increased spacing */}
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-premium-mesh pt-36 pb-32 lg:pt-56 lg:pb-44">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2 animate-pulse-soft pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        {/* Subtle grid for texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

        <div className="container-wide w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-center">
            
            {/* HERO TEXT (7/12) */}
            <div className="lg:col-span-7 space-y-10 text-center lg:text-left order-2 lg:order-1 mt-10 lg:mt-0">
              <FadeIn>
                <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-background/50 backdrop-blur-md border border-border shadow-2xl shadow-black/[0.03] text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                  <Sparkles className="w-4 h-4" />
                  Pollachi's Exclusive Artisan Hub
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                {/* Scaled-down H1 for mobile-first balance (2.6rem on mobile as recommended) */}
                <h1 className="text-[2.6rem] sm:text-6xl lg:text-[5.5rem] font-black font-display text-foreground leading-[1.05] -tracking-[0.03em]">
                  Revive Your <br/>
                  <span className="text-gradient">Wardrobe.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  We don't just wash clothes; we preserve them. Pollachi's only scientific artisan dry cleaning with premium eco-solvents.
                </p>
              </FadeIn>

              <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-5 items-center lg:items-start justify-center lg:justify-start pt-6">
                <Link href="/schedule-pickup">
                  <Button size="lg" className="w-full sm:w-auto min-w-[280px] shadow-2xl group transition-all h-20">
                    Schedule Free Pickup
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[220px] bg-background/50 border-black/[0.03] text-muted-foreground h-20">
                    See All Services
                  </Button>
                </Link>
              </FadeIn>

              <FadeIn delay={0.4} className="flex flex-wrap items-center justify-center lg:justify-start gap-10 mt-16 opacity-40">
                {[
                  { icon: MapPin, label: "Free 3km Hub" },
                  { icon: Clock, label: "48h Promised" },
                  { icon: CheckCircle2, label: "Eco-Solvent" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-foreground">
                    <Icon className="w-5 h-5 text-primary" />
                    {label}
                  </div>
                ))}
              </FadeIn>
            </div>

            {/* HERO VISUAL (5/12) - Balanced with gutters as requested */}
            <div className="lg:col-span-5 relative order-1 lg:order-2">
              <FadeIn delay={0.2} className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3.5/4] group px-4 lg:px-0 max-h-[500px] lg:max-h-none">
                {/* Visual breathing room */}
                <div className="absolute -inset-10 bg-primary/5 rounded-[4rem] blur-[5rem] group-hover:bg-primary/10 transition-colors duration-1000" />
                <div className="absolute inset-0 bg-background border-[14px] border-background shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[4.5rem] overflow-hidden group-hover:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] transition-shadow">
                  <motion.img
                    src={`${import.meta.env.BASE_URL}images/premium-hero.png`}
                    alt="Premium Laundry Lifestyle"
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Floating Metric */}
                <motion.div 
                  className="absolute -bottom-10 -left-6 lg:-left-20 bg-background shadow-2xl rounded-3xl p-6 border border-border/50 flex items-center gap-5 z-20 hover:scale-105 transition-transform"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-lime-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mb-0.5">Delivered</div>
                    <div className="text-2xl font-black text-foreground tabular-nums tracking-tighter">50,000<span className="text-primary text-xs ml-0.5">+</span></div>
                  </div>
                </motion.div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─────────────────────────────────── */}
      <section className="py-24 bg-card border-y border-border/10 relative z-20">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
            {[
              { val: "2,000+", label: "Clothes Weekly" },
              { val: "2", label: "Smart Hubs" },
              { val: "100%", label: "Eco-Friendly" },
              { val: "48h", label: "Guaranteed Turn" },
            ].map((m, i) => (
              <FadeIn key={i} delay={0.1 * i} className="text-center group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-foreground mb-2 group-hover:text-primary transition-colors tracking-tight tabular-nums">{m.val}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">{m.label}</div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {mockServices.map((s, i) => (
              <FadeIn key={s.id} delay={0.1 * i}>
                <Card className="p-10 h-full flex flex-col group bg-background shadow-xl shadow-black/[0.02] rounded-[3.5rem] border-transparent hover:border-border/50 transition-all">
                  <div className="w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center text-foreground mb-10 group-hover:bg-lime-gradient group-hover:text-white transition-all duration-700 shadow-sm">
                    <s.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black font-display text-foreground mb-4 leading-tight group-hover:text-primary transition-colors tracking-tight">{s.name}</h3>
                  <p className="text-muted-foreground text-lg mb-12 flex-grow leading-relaxed font-medium">{s.short}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-8 border-t border-black/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Starts {s.price}</span>
                    <div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-white transition-all duration-500">
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            {[
              { n: "01", t: "Assessment", d: "Microscopic inspection of fibers and hidden stain analysis." },
              { n: "02", t: "Sorting", d: "Segregation based on PH balance and fabric weight." },
              { n: "03", t: "Spotting", d: "Targeted organic treatment for stubborn old stains." },
              { n: "04", t: "Restoration", d: "Miele technology paired with premium eco-solvents." },
              { n: "05", t: "Final Press", d: "Precision steam ironing for factory-original fit." },
              { n: "06", t: "Sanitation", d: "UVC-safe packaging ensuring clinical garment hygiene." },
            ].map((step, i) => (
              <FadeIn key={step.n} delay={0.1 * i} className="relative group text-center md:text-left">
                <span className="text-[90px] font-black font-display text-primary/[0.05] absolute -top-12 -left-4 lg:-left-6 transition-colors group-hover:text-primary/[0.1] leading-none -z-10">{step.n}</span>
                <div className="pt-8 px-4 md:px-0">
                  <h4 className="text-2xl font-black text-foreground mb-4 group-hover:translate-x-3 transition-transform tracking-tight">{step.t}</h4>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">{step.d}</p>
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
            className="relative rounded-[5rem] overflow-hidden bg-[#0a0a0a] p-16 md:p-32 text-center text-white shadow-3xl shadow-black/20 group"
          >
            {/* Texture/Bloom */}
            <div className="absolute inset-0 bg-premium-mesh opacity-5 grayscale invert pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
            
            <div className="relative z-10 space-y-12 max-w-4xl mx-auto">
              <h2 className="text-[2.6rem] md:text-[5rem] lg:text-[6.5rem] font-black font-display leading-[1] mb-8">
                The Luxury of <br/>
                <span className="text-primary italic font-serif tracking-normal">Extra Time.</span>
              </h2>
              <p className="text-white/40 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                Join 1,200+ premium households in Pollachi who've upgraded their life with Fab Clean.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-10">
                <Link href="/schedule-pickup">
                  <Button size="lg" className="h-24 px-20 text-xs font-black shadow-3xl hover:scale-110 active:scale-95 transition-all w-full sm:w-auto">
                    Schedule Pickup
                  </Button>
                </Link>
                <a href="tel:+919363059595">
                  <Button size="lg" variant="outline" className="h-24 px-16 border-white/10 text-white hover:bg-white/5 hover:border-white/20 text-xs font-black w-full sm:w-auto">
                    <Phone className="mr-3 w-5 h-5 opacity-40" />
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
