import { AppLayout } from "@/components/layout";
import { SectionHeading, Card, FadeIn, Button } from "@/components/ui";
import { useListPricing } from "@workspace/api-client-react";
import { Loader2, ArrowRight, CheckCircle2, Star, Sparkles, Phone } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "wouter";

export default function Pricing() {
  const { data, isLoading } = useListPricing();

  return (
    <AppLayout>
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/2 rounded-full blur-[200px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[180px] -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="section-padding relative z-10 overflow-hidden pt-44">
        <div className="container-wide relative z-10 w-full mb-12">
          <SectionHeading 
            title="Premium Value, Pure Transparency" 
            subtitle="The Artisan Rates"
            className="mb-32"
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-44 space-y-10">
              <div className="relative">
                 <Loader2 className="w-20 h-20 animate-spin text-primary opacity-20" />
                 <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-float" />
              </div>
              <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Fetching Rates...</p>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-44">
              {data?.data.map((category, i) => (
                <FadeIn key={category.category} delay={i * 0.1}>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10 px-6 lg:px-0">
                    <div>
                      <h3 className="text-5xl md:text-7xl font-black font-display text-foreground mb-4 -tracking-[0.03em]">
                        {category.category}
                      </h3>
                      <div className="h-2 w-32 rounded-full bg-lime-gradient shadow-[0_4px_16px_rgba(180,197,36,0.3)]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground bg-muted/30 px-6 py-3 rounded-2xl border border-border/50">Verified {new Date().getFullYear()} Precision</span>
                    </div>
                  </div>
                  
                  <Card className="overflow-hidden border-border/30 bg-background/40 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] rounded-[4.5rem] p-8 lg:p-16 group/table relative">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />

                    <table className="w-full text-left border-collapse relative z-10">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="py-10 px-8 font-black text-muted-foreground/50 text-[10px] uppercase tracking-[0.4em]">Item Name</th>
                          <th className="py-10 px-8 font-black text-muted-foreground/50 text-[10px] uppercase tracking-[0.4em] hidden md:table-cell">Standard Care</th>
                          <th className="py-10 px-8 font-black text-muted-foreground/50 text-[10px] uppercase tracking-[0.4em] text-right">Investment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10">
                        {category.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-primary/[0.03] transition-all group duration-700">
                            <td className="py-12 px-8">
                              <div className="text-3xl font-black text-foreground group-hover:text-primary transition-all duration-500 group-hover:pl-4 -tracking-wide">
                                {item.item}
                              </div>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mt-2 md:hidden">
                                {item.type || 'Signature Care'}
                              </div>
                            </td>
                            <td className="py-12 px-8 text-muted-foreground/60 font-medium text-xl hidden md:table-cell italic font-serif">
                              {item.type || 'Signature Care'}
                            </td>
                            <td className="py-12 px-8 text-right font-black text-4xl tabular-nums -tracking-tight decoration-primary/10 decoration-8 underline-offset-[-2px]">
                              <span className="text-foreground group-hover:text-primary transition-colors">
                                {formatCurrency(item.price)}
                              </span>
                              {item.unit && <span className="text-muted-foreground/20 text-[10px] font-black uppercase ml-4 opacity-50 tracking-[0.3em] font-sans">per {item.unit}</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </FadeIn>
              ))}
              
              {/* Extra Pricing Note */}
              <FadeIn className="bg-foreground text-white p-20 lg:p-32 rounded-[6rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.4)] flex flex-col items-center justify-between gap-20 relative overflow-hidden group mb-32">
                <div className="absolute inset-0 bg-premium-mesh opacity-5 grayscale invert pointer-events-none" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -translate-x-1/2 pointer-events-none" />
                
                <div className="max-w-xl text-center relative z-10 space-y-10">
                  <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/5 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                    <CheckCircle2 className="w-5 h-5 shadow-2xl" strokeWidth={3} />
                    Complimentary Pickup & Delivery
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black font-display leading-[1.1] tracking-tight">Free Convenience within 3km Hub Radius.</h3>
                  <p className="text-white/30 text-2xl font-medium leading-relaxed">Join 1,200+ households who value their time as much as their wardrobe. No hidden fees, just perfect results.</p>
                </div>
                
                <div className="relative z-10 flex flex-col sm:flex-row gap-6 shrink-0 w-full justify-center">
                    <Link href="/schedule-pickup">
                    <Button className="h-24 px-20 text-xs font-black shadow-2xl hover:scale-110 active:scale-95 transition-all">
                        Book First Pickup <ArrowRight className="ml-4 w-6 h-6"/>
                    </Button>
                    </Link>
                    <a href="tel:+919363059595">
                    <Button variant="outline" className="h-24 px-16 border-white/10 text-white hover:bg-white/5 hover:border-white/20 text-xs font-black">
                        <Phone className="mr-3 w-5 h-5 opacity-40" />
                        Logistics Line
                    </Button>
                    </a>
                </div>
              </FadeIn>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
