import { Link } from "wouter";
import { AppLayout } from "@/components/layout";
import { Button, SectionHeading, FadeIn, Card } from "@/components/ui";
import {
  CheckCircle2, Clock, MapPin, Leaf, Star,
  Shirt, Briefcase, Zap, ArrowRight, Phone, Sparkles
} from "lucide-react";

const mockServices = [
  { id: "1", name: "Premium Dry Cleaning", short: "Suits, sarees, silk, delicate garments", icon: Briefcase, price: "₹150" },
  { id: "2", name: "Premium Laundry", short: "Wash, dry & steam iron service", icon: Shirt, price: "₹45" },
  { id: "3", name: "Shoe Cleaning", short: "Sports shoes & leather shoes", icon: Zap, price: "₹300" },
  { id: "4", name: "Laundry by KG", short: "Bulk wash+iron or wash+fold", icon: CheckCircle2, price: "₹70/kg" },
];

const testimonials = [
  { name: "Priya Menon", location: "Pollachi", stars: 5, text: "My silk sarees came back absolutely pristine. The quality of care here is unmatched in Pollachi!" },
  { name: "Rajesh Kumar", location: "Kinathukadavu", stars: 5, text: "Quick, reliable, and the clothes smell amazing. Their 48-hour express service saved me before my wedding." },
  { name: "Deepa Suresh", location: "Pollachi", stars: 5, text: "Finally a service that treats expensive garments with the care they deserve. Highly recommend!" },
];

export default function Home() {
  return (
    <AppLayout>

      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center pt-20 overflow-hidden bg-white">
        {/* Lime accent blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4" />
                  Premium Care in Pollachi &amp; Kinathukadavu
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-display text-foreground leading-[1.1] mb-6">
                  Your clothes deserve the{" "}
                  <span className="text-gradient">best care.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                  We treat your clothes like our own — with care and precision.
                  Experience the finest dry cleaning and laundry services delivered right to your door.
                </p>
              </FadeIn>

              <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4">
                <Link href="/schedule-pickup">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 bg-lime-gradient text-primary-foreground shadow-md shadow-primary/25 hover:opacity-90 hover:shadow-primary/40">
                    Schedule Free Pickup
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 border-border text-foreground hover:bg-muted hover:border-primary/40">
                    Explore Services
                  </Button>
                </Link>
              </FadeIn>

              <FadeIn delay={0.4} className="mt-10 flex flex-wrap gap-6">
                {[
                  { icon: MapPin, label: "Free 3km Pickup" },
                  { icon: Clock, label: "48hr Express" },
                  { icon: Leaf, label: "Eco-Friendly" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" />
                    {label}
                  </div>
                ))}
              </FadeIn>
            </div>

            {/* Hero visual */}
            <FadeIn delay={0.2} className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="aspect-square rounded-3xl bg-muted border border-border overflow-hidden shadow-xl">
                  <img
                    src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
                    alt="Fab Clean premium laundry"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Float badge */}
                <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-lg border border-border p-4 flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                    <div className="text-sm font-semibold text-foreground">2000+ clothes</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg border border-border p-3 flex items-center gap-2 animate-float" style={{ animationDelay: "1.5s" }}>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-foreground">4.9</span>
                  <span className="text-xs text-muted-foreground">rating</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─────────────────────────────────── */}
      <section className="py-10 section-linen border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shirt, value: "2000+", label: "Clothes Cleaned" },
              { icon: MapPin, value: "2", label: "Branches" },
              { icon: Clock, value: "48hr", label: "Express Turnaround" },
              { icon: CheckCircle2, value: "3 km", label: "Free Pickup Radius" },
            ].map((metric, i) => (
              <FadeIn key={i} delay={0.1 * i} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                  <metric.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-black font-display text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES PREVIEW ──────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Premium Services"
            subtitle="What we offer"
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockServices.map((service, i) => (
              <FadeIn key={service.id} delay={0.1 * i}>
                <Card className="p-6 h-full flex flex-col hover-glow group cursor-pointer border-border hover:border-primary/40 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-white">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-5 flex-grow leading-relaxed">{service.short}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="text-primary font-bold">from {service.price}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/services">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary hover:bg-primary/10">
                View All 8 Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────── */}
      <section className="py-24 section-linen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/4 to-secondary/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            title="The 6-Stage Process"
            subtitle="How it works"
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Assessment", desc: "Pre-wash identification of fabric type and care labels." },
              { num: "02", title: "Sorting", desc: "Segregation by fabric type, colour, and care instructions." },
              { num: "03", title: "Spot Treatment", desc: "Targeted stain removal using imported professional solutions." },
              { num: "04", title: "Processing", desc: "Main wash or dry cleaning in advanced eco-friendly machines." },
              { num: "05", title: "Finishing", desc: "Garment-specific steam ironing for a crisp, perfect finish." },
              { num: "06", title: "Packaging", desc: "Expert quality inspection and premium packaging." },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={0.1 * i}>
                <div className="flex gap-4 p-6 rounded-2xl bg-white border border-border hover:border-primary/30 hover:shadow-md transition-all group">
                  <span className="text-5xl font-black font-display text-primary/15 group-hover:text-primary/30 transition-colors leading-none">{step.num}</span>
                  <div className="pt-1">
                    <h4 className="text-base font-bold text-foreground mb-1.5">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose Fab Clean?"
            subtitle="Our difference"
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🌿", title: "Eco-Friendly", desc: "Environment-safe solvents and globally standardised cleaning technologies." },
              { emoji: "👁️", title: "Watch It Live", desc: "Unique transparency — watch your clothes being washed in-store." },
              { emoji: "⚡", title: "48hr Express", desc: "Time-sensitive? Our express turnaround gets your clothes back fast." },
              { emoji: "🏆", title: "Expert Team", desc: "Trained professionals who care for even the most delicate fabrics." },
            ].map((item, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className="p-6 rounded-2xl border border-border hover:border-primary/40 hover:shadow-md bg-white transition-all text-center group">
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCATIONS ─────────────────────────────────── */}
      <section className="py-24 section-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Find Us Near You"
            subtitle="Our branches"
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                branch: "Pollachi",
                address: "#16, Venkatramana Round Road, Opp Naturals Salon / HDFC Bank, Mahalingapuram, Pollachi – 642002",
                phone: "93630 59595",
                tel: "9363059595",
              },
              {
                branch: "Kinathukadavu",
                address: "#442/11, Opp MLA Office, Krishnasamypuram, Kinathukadavu – 642109",
                phone: "93637 19595",
                tel: "9363719595",
              },
            ].map((loc) => (
              <FadeIn key={loc.branch}>
                <div className="p-8 bg-white rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display text-foreground">{loc.branch} Branch</h3>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{loc.address}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={`tel:${loc.tel}`}>
                      <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
                        <Phone className="w-4 h-4" /> {loc.phone}
                      </Button>
                    </a>
                    <p className="text-xs text-muted-foreground self-center">Mon–Sat: 10AM – 8PM | Sunday: Closed</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What Our Customers Say"
            subtitle="Testimonials"
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className="p-6 rounded-2xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex mb-4">
                    {[...Array(t.stars)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.location}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA STRIP ─────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden bg-lime-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Ready for the best laundry experience?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Schedule a free pickup today — within 3 km of our branches in Pollachi &amp; Kinathukadavu.
            </p>
            <Link href="/schedule-pickup">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/95 font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all"
              >
                Book Your Free Pickup
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

    </AppLayout>
  );
}
