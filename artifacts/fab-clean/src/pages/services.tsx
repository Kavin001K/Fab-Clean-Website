import { AppLayout } from "@/components/layout";
import { SectionHeading, Card, FadeIn, Button } from "@/components/ui";
import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Loader2, Star, Briefcase, Shirt, Zap, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Fallback icons map for nicer visuals
const ICON_MAP: Record<string, any> = {
  "shirt": Shirt,
  "briefcase": Briefcase,
  "zap": Zap,
  "default": Shirt
};

export default function Services() {
  const { data, isLoading } = useListServices();
  const isMobile = useIsMobile();

  return (
    <AppLayout>
      {/* ─── OPTIMIZED VIDEO BACKGROUND ─────────────────────────── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {!isMobile ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover opacity-40 grayscale-[20%]"
            poster={`${import.meta.env.BASE_URL}images/hero-bg.webp`}
          >
            <source src={`${import.meta.env.BASE_URL}service-background.webm`} type="video/webm" />
            <source src={`${import.meta.env.BASE_URL}service-background.mp4`} type="video/mp4" />
          </video>
        ) : (
          <picture>
            <source
              srcSet={`${import.meta.env.BASE_URL}images/hero-bg.webp`}
              type="image/webp"
            />
            <img
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
              alt=""
              className="w-full h-full object-cover opacity-40 grayscale-[20%]"
              loading="lazy"
              decoding="async"
            />
          </picture>
        )}
        {/* High-End Glassmorphism & Atmospheric Overlays */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
        
        {/* Dynamic accent blobs for depth */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2 animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-secondary/10 rounded-full blur-[180px] -translate-x-1/2 translate-y-1/2 animate-pulse-soft delay-1000" />
        
        {/* Subtle grid texture for a technical/scientific feel */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <div className="section-padding relative z-10 overflow-hidden pt-44">
        <div className="container-wide">
          <SectionHeading 
            title="Artisan Care for Every Thread" 
            subtitle="The Premium Ensemble"
            className="mb-32"
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-44 space-y-10">
              <div className="relative">
                 <Loader2 className="w-20 h-20 animate-spin text-primary opacity-20" />
                 <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-float" />
              </div>
              <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Initializing Catalog...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {data?.data?.map((service, i) => {
                const IconComp = ICON_MAP[service.icon?.toLowerCase()] || ICON_MAP.default;
                return (
                  <FadeIn key={service.id} delay={i * 0.1}>
                    <Card className="h-full flex flex-col p-12 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all bg-background group relative overflow-hidden rounded-[4rem]">
                      {/* Background accent */}
                      <div className="absolute top-0 right-0 w-44 h-44 bg-primary/[0.01] rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 group-hover:bg-primary/5 transition-all duration-700" />
                      
                      <div className="flex justify-between items-start mb-16 relative z-10">
                        <div className="w-24 h-24 rounded-[2.2rem] bg-muted/30 flex items-center justify-center text-foreground group-hover:bg-lime-gradient group-hover:text-primary-foreground group-hover:shadow-2xl transition-all duration-700 shadow-sm border border-border/50">
                          <IconComp className="w-12 h-12" />
                        </div>
                        <div className="flex flex-col items-end pt-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Starting from</span>
                          <span className="text-3xl font-black text-foreground font-display">
                            ₹{service.startingPrice}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-4xl font-black font-display text-foreground mb-6 leading-tight group-hover:text-primary transition-colors tracking-tight">{service.name}</h3>
                      <p className="text-muted-foreground text-xl mb-12 flex-grow leading-relaxed font-medium">{service.description}</p>

                      <div className="space-y-6 mb-16">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-4 bg-muted/20 px-5 py-2 rounded-full w-fit">Key Highlights</p>
                        {service.features?.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-base font-bold text-foreground/70 group-hover:translate-x-3 transition-transform">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(180,197,36,0.6)]" />
                            </div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div className="pt-10 border-t border-border/30 relative z-10">
                        <Link href="/schedule-pickup">
                          <Button className="w-full h-20 text-xs font-black rounded-[2rem] group-hover:scale-105 transition-all flex items-center justify-between px-10">
                            Book This Service
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          )}
          
          <FadeIn delay={0.4} className="mt-44 text-center p-20 lg:p-32 bg-foreground rounded-[6rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group">
             {/* Background mesh texture */}
             <div className="absolute inset-0 bg-premium-mesh opacity-5 grayscale invert pointer-events-none" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
             
             <div className="relative z-10 max-w-3xl mx-auto space-y-10">
               <div className="w-24 h-24 rounded-[2.5rem] bg-white/10 mx-auto flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-700">
                  <Star className="w-12 h-12 fill-primary" />
               </div>
               <h2 className="text-5xl md:text-7xl font-black font-display text-white leading-tight">Need Artisan Consultation?</h2>
               <p className="text-white/40 text-2xl font-medium leading-relaxed">We specialize in luxury brands, wedding couture, and museum-grade fiber restoration with organic solvents.</p>
               <div className="pt-10">
                <Link href="/contact">
                  <Button variant="premium" className="h-24 px-20 text-xs font-black tracking-[0.3em] shadow-2xl hover:scale-110 active:scale-95 transition-all">Talk to Our Experts</Button>
                </Link>
               </div>
             </div>
          </FadeIn>
        </div>
      </div>
    </AppLayout>
  );
}
