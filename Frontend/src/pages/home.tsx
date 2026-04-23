import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Shirt,
  Sparkles,
  Star,
  Truck,
  WashingMachine,
  Shield,
  Zap,
  Award,
  Heart,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, SectionHeading } from "@/components/ui";
import { GlassBlobBackground } from "@/components/GlassBlobBackground";
import { ChromaticText } from "@/components/ChromaticText";
import { IridescentBorder } from "@/components/IridescentBorder";
import { fetchHomepageReviews, type HomepageReview } from "@/lib/public-api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function formatReviewTimestamp(value?: string | null) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

const serviceHighlights = [
  {
    icon: Shirt,
    title: "Dry cleaning for special garments",
    text: "Sarees, suits, lehengas, coats, and fabrics that need careful handling.",
  },
  {
    icon: WashingMachine,
    title: "Everyday laundry and household linen",
    text: "Daily wear, bedsheets, towels, curtains, and regular wash-and-fold orders.",
  },
  {
    icon: Sparkles,
    title: "Shoe, bag, and premium fabric care",
    text: "Cleaning for items that need more than a standard wash cycle.",
  },
];

const whyChooseFabClean = [
  {
    icon: Truck,
    title: "Pickup and delivery updates",
    text: "Customers can book pickups, track orders, and receive clear status changes.",
  },
  {
    icon: Clock3,
    title: "Clear turnaround communication",
    text: "The website explains what is happening and what the next step is.",
  },
  {
    icon: CheckCircle2,
    title: "Careful handling with service feedback",
    text: "Every order can collect feedback, which helps us surface the best reviews and improve service.",
  },
];

export default function Home() {
  const [reviews, setReviews] = useState<HomepageReview[]>([]);

  useEffect(() => {
    void fetchHomepageReviews()
      .then((result) => {
        setReviews([
          ...(result.data.topReviews || []),
          ...(result.data.bestReviews || []),
          ...(result.data.latestReviews || []),
        ]);
      })
      .catch(() => setReviews([]));
  }, []);

  const visibleReviews = useMemo(() => {
    const seen = new Set<string>();
    return reviews.filter((review) => {
      if (seen.has(review.id)) return false;
      seen.add(review.id);
      return true;
    }).slice(0, 3);
  }, [reviews]);

  return (
    <AppLayout>
      <SEO
        title="Fab Clean | Laundry, Dry Cleaning, Pickup, Tracking, and Reviews"
        description="Book pickup, track orders, and get clear garment care support from Fab Clean. Dry cleaning, laundry, shoes, linen, and customer feedback all in one place."
        canonical="https://myfabclean.com/"
      />

      <div className="page-shell">
        {/* Hero Section */}
        <section className="container-wide section-padding relative overflow-hidden">
          {/* Liquid Glass Background */}
          <GlassBlobBackground className="opacity-70" count={5} />
          <div className="absolute inset-0 -z-10 overflow-hidden bg-premium-mesh subtle-grid">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
          </div>

          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-10"
            >
              <motion.div variants={itemVariants} className="space-y-8">
                <Badge variant="accent" className="inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                  <Zap className="h-3 w-3" />
                  Pollachi's Premium Dry Cleaning
                </Badge>

                <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                  <ChromaticText intensity={0.3} hoverIntensity={1}>Fresh Clothes,</ChromaticText>
                  <span className="block text-gradient mt-3">Delivered with Care</span>
                </h1>

                <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  Experience premium dry cleaning and laundry service with free doorstep pickup,
                  real-time tracking, and eco-friendly care for all your garments.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row">
                <Link href="/schedule-pickup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="group">
                      <span>Book Free Pickup</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/track-order">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="lg">
                      Track Your Order
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 gap-4 pt-8 sm:grid-cols-3"
              >
                {[
                  {
                    icon: Truck,
                    title: "Free Pickup",
                    bgClass: "bg-primary/10",
                    textClass: "text-primary",
                  },
                  {
                    icon: Shield,
                    title: "Eco-Friendly",
                    bgClass: "bg-accent/10",
                    textClass: "text-accent",
                  },
                  {
                    icon: Award,
                    title: "Premium Quality",
                    bgClass: "bg-secondary/10",
                    textClass: "text-secondary",
                  },
                ].map((item, index) => (
                  <IridescentBorder borderWidth={1} speed={8}>
                    <motion.div
                      key={item.title}
                      variants={itemVariants}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-sm"
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bgClass} ${item.textClass}`}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold">{item.title}</span>
                    </motion.div>
                  </IridescentBorder>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="hero-image-card overflow-hidden rounded-3xl border-0 shadow-2xl">
                <picture>
                  <source srcSet={`${import.meta.env.BASE_URL}images/premium-hero.webp`} type="image/webp" />
                  <img
                    src={`${import.meta.env.BASE_URL}images/premium-hero.png`}
                    alt="Freshly cleaned garments prepared for delivery"
                    className="h-full min-h-[500px] w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </picture>

                {/* Floating Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute left-6 top-6 surface-card p-5 backdrop-blur-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-black">5000+</p>
                      <p className="text-sm text-muted-foreground">Happy Customers</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute right-6 bottom-6 surface-card p-5 backdrop-blur-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                      <CheckCircle2 className="h-7 w-7 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-black">98%</p>
                      <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2"
            >
              <ChevronDown className="h-6 w-6 text-primary/70" />
              <span className="text-xs font-bold text-primary/70">Scroll to explore</span>
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="container-wide section-padding">
          <FadeIn>
            <SectionHeading title="How Fab Clean works" subtitle="Three simple steps" />
          </FadeIn>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {[
              {
                step: "01",
                title: "Book pickup or walk in",
                text: "Choose the service, pickup time, and branch that works for you.",
                icon: Clock3,
              },
              {
                step: "02",
                title: "Track progress online",
                text: "Check your order status any time using the order number or link.",
                icon: Truck,
              },
              {
                step: "03",
                title: "Review the service",
                text: "Your feedback is saved to the order and helps improve what we do next.",
                icon: Star,
              },
            ].map((item, index) => (
              <motion.div key={item.step} variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                <IridescentBorder borderWidth={2} speed={10}>
                  <Card className="h-full p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <Badge variant="accent">{item.step}</Badge>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">{item.text}</p>
                  </Card>
                </IridescentBorder>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="container-wide section-padding">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
            <FadeIn className="space-y-8">
              <SectionHeading
                align="left"
                title="Premium care for every garment"
                subtitle="Popular categories"
              />
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                From everyday wear to delicate fabrics, we provide specialized cleaning and handling for everything in your wardrobe.
              </p>
              <Link href="/services">
                <Button variant="outline" className="group">
                  View all services
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </FadeIn>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {serviceHighlights.map((item, index) => (
                <motion.div key={item.title} variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                  <IridescentBorder borderWidth={2} speed={12}>
                    <Card className="h-full p-7 hover:shadow-2xl transition-all duration-300">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
                      <p className="mt-4 text-base leading-7 text-muted-foreground">{item.text}</p>
                    </Card>
                  </IridescentBorder>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="container-wide section-padding">
          <FadeIn>
            <SectionHeading title="Why customers stay with Fab Clean" subtitle="Built for clarity" />
          </FadeIn>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="mt-16 grid gap-8 lg:grid-cols-3"
          >
            {whyChooseFabClean.map((item, index) => (
              <motion.div key={item.title} variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                <IridescentBorder borderWidth={2} speed={14}>
                  <Card className="h-full p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-black">{item.title}</h3>
                    </div>
                    <p className="mt-6 text-base leading-7 text-muted-foreground">{item.text}</p>
                  </Card>
                </IridescentBorder>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Reviews Section */}
        <section className="container-wide section-padding">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <FadeIn>
              <SectionHeading align="left" title="What customers are saying now" subtitle="Live review preview" />
            </FadeIn>
            <FadeIn>
              <Link href="/reviews">
                <Button variant="outline" className="group">
                  Open all reviews
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </FadeIn>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="mt-16 grid gap-8 lg:grid-cols-3"
          >
            {(visibleReviews.length ? visibleReviews : [
              { id: "fallback-1", customer_name: "Fab Clean Customer", rating: 5, feedback: "Fresh reviews will appear here once new feedback is approved.", created_at: new Date().toISOString() },
            ]).map((review, index) => (
              <motion.div key={review.id} variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                <IridescentBorder borderWidth={2} speed={16}>
                  <Card className="h-full p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: Number(review.rating || 5) }, (_, starIndex) => (
                        <Star key={starIndex} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="mt-6 text-lg leading-8 text-foreground">"{review.feedback || "Clean, clear, and reliable service."}"</p>
                    <div className="mt-8">
                      <p className="font-bold text-foreground">{review.customer_name || "Fab Clean Customer"}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{formatReviewTimestamp(review.created_at)}</p>
                    </div>
                  </Card>
                </IridescentBorder>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Location & CTA Section */}
        <section className="container-wide section-padding">
          <div className="grid gap-8 lg:grid-cols-2">
            <FadeIn>
              <IridescentBorder borderWidth={2} speed={18}>
                <Card className="h-full p-8 sm:p-10 hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-4xl font-black sm:text-5xl">Reliable pickup across Pollachi and nearby areas</h2>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                    Our dedicated team ensures your garments are collected and delivered with care, right from your doorstep.
                  </p>

                  <div className="mt-10 grid gap-6 sm:grid-cols-2">
                    {[
                      {
                        branch: "Pollachi branch",
                        address: "#16, Venkatramana Round Road, Mahalingapuram, Pollachi",
                      },
                      {
                        branch: "Kinathukadavu branch",
                        address: "#442/11, Krishnasamypuram, Kinathukadavu",
                      },
                    ].map((item) => (
                      <div key={item.branch} className="surface-soft p-6 rounded-2xl hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <MapPin className="mt-1 h-5 w-5 text-primary" />
                          <div>
                            <p className="font-black text-foreground">{item.branch}</p>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </IridescentBorder>
            </FadeIn>

            <FadeIn delay={0.06}>
              <Card className="h-full bg-brand-gradient p-8 sm:p-10 text-white overflow-hidden relative hover:scale-[1.02] transition-transform duration-300">
                {/* Background pattern */}
                <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

                <div className="relative z-10">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-white/80">Need help right now?</p>
                  <h2 className="mt-6 text-4xl font-black sm:text-5xl">Fresh clothes are just a click away.</h2>
                  <p className="mt-6 text-lg leading-8 text-white/80">
                    Book a pickup for your next laundry day, or track the progress of your current items in real-time.
                  </p>
                  <div className="mt-10 grid gap-4">
                    <Link href="/schedule-pickup">
                      <Button variant="secondary" className="w-full justify-center">
                        Book pickup
                      </Button>
                    </Link>
                    <Link href="/track-order">
                      <Button variant="outline" className="w-full justify-center border-white/25 bg-white/10 text-white hover:bg-white/16">
                        Track an order
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </FadeIn>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
