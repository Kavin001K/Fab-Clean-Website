import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListServices } from "@workspace/api-client-react";
import { ArrowRight, BriefcaseBusiness, Loader2, Shirt, Sparkles, WashingMachine } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Badge, Button, Card, FadeIn, SectionHeading } from "@/components/ui";

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

const iconMap: Record<string, typeof Shirt> = {
  shirt: Shirt,
  briefcase: BriefcaseBusiness,
  zap: Sparkles,
  laundry: WashingMachine,
};

export default function Services() {
  const { data, isLoading } = useListServices();

  return (
    <AppLayout>
      <SEO
        title="Services | Fab Clean"
        description="See Fab Clean service categories, what each one includes, who it is best for, and where to start."
        canonical="https://myfabclean.com/services"
      />

      <div className="page-shell">
        {/* Hero Section */}
        <section className="container-wide section-padding relative overflow-hidden">
          {/* Modern Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden bg-premium-mesh subtle-grid">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="accent" className="inline-flex items-center gap-2 mb-8 hover:scale-105 transition-transform duration-200">
                <Sparkles className="h-3 w-3" />
                Premium Garment Care
              </Badge>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Garment care for
                <span className="block text-gradient mt-3">every occasion</span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Explore our professional laundry and dry cleaning options. Each service is tailored to provide the best care for your garments, ensuring they look and feel their best.
              </p>
            </motion.div>
          </motion.div>
        </section>

        <section className="container-wide pb-20">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {data?.data?.map((service, index) => {
                const Icon = iconMap[service.icon?.toLowerCase() || ""] || Shirt;
                const bestFor = service.features?.[0] || "Daily wear and common garment care needs";
                const includes = service.features?.slice(0, 3) || [];

                return (
                  <FadeIn key={service.id} delay={index * 0.05}>
                    <Card className="flex h-full flex-col p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-7 w-7" />
                        </div>
                        <Badge variant="accent">From ₹{service.startingPrice}</Badge>
                      </div>

                      <h2 className="mt-6 text-3xl font-black">{service.name}</h2>
                      <p className="mt-4 text-base leading-7 text-muted-foreground">{service.description}</p>

                      <div className="mt-6 rounded-[1.25rem] bg-muted/70 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Best for</p>
                        <p className="mt-2 text-sm leading-7 text-foreground">{bestFor}</p>
                      </div>

                      <div className="mt-6 flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">What is usually included</p>
                        <div className="mt-3 space-y-3">
                          {includes.length ? includes.map((item) => (
                            <div key={item} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                              <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                              <span>{item}</span>
                            </div>
                          )) : (
                            <p className="text-sm leading-7 text-muted-foreground">Inspection, appropriate cleaning, and careful handling based on the garment type.</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href="/schedule-pickup">
                          <Button className="w-full">
                            Book this service
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href="/pricing">
                          <Button variant="outline" className="w-full">
                            View pricing
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </section>

        <section className="container-wide pb-20">
          <FadeIn>
            <Card className="bg-brand-gradient p-7 text-white sm:p-8 hover:scale-[1.02] transition-transform duration-300">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-white/80">Still not sure?</p>
                  <h2 className="mt-4 text-4xl font-black sm:text-5xl">Ready to give your garments the care they deserve?</h2>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
                    If you have questions about a specific item or need custom care, our team is here to help. Reach out to us or schedule a pickup today.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link href="/contact">
                    <Button variant="secondary" className="w-full">Talk to the team</Button>
                  </Link>
                  <Link href="/schedule-pickup">
                    <Button variant="outline" className="w-full border-white/25 bg-white/10 text-white hover:bg-white/16">
                      Schedule pickup
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </FadeIn>
        </section>
      </div>
    </AppLayout>
  );
}
