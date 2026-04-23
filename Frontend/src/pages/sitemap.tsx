import { Link } from "wouter";
import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button, FadeIn, SectionHeading } from "@/components/ui";
import { SupportBand } from "@/components/site";

const groups = [
  {
    title: "Main pages",
    links: [
      { name: "Home", href: "/" },
      { name: "Services", href: "/services" },
      { name: "Pricing", href: "/pricing" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Customer actions",
    links: [
      { name: "Schedule Pickup", href: "/schedule-pickup" },
      { name: "Track Order", href: "/track-order" },
      { name: "Feedback", href: "/feedback" },
      { name: "Reviews", href: "/reviews" },
    ],
  },
  {
    title: "Portal and legal",
    links: [
      { name: "Login", href: "/login" },
      { name: "Register", href: "/register" },
      { name: "Dashboard", href: "/dashboard/orders" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Refund", href: "/refund" },
      { name: "Cookies", href: "/cookies" },
    ],
  },
];

export default function Sitemap() {
  return (
    <AppLayout>
      <SEO
        title="Sitemap | Fab Clean"
        description="A clean directory of Fab Clean's primary pages, actions, and portal routes."
        canonical="https://myfabclean.com/sitemap"
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading title="A sitemap should still look considered." subtitle="Sitemap" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            The redesigned sitemap keeps route discovery simple without dropping back to placeholder styling.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {groups.map((group, index) => (
              <FadeIn key={group.title} delay={index * 0.05}>
                <div className="visual-card p-7">
                  <p className="eyebrow">{group.title}</p>
                  <div className="mt-6 grid gap-3">
                    {group.links.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <div className="rounded-[1.35rem] border border-line bg-background/70 px-4 py-4 text-sm text-ink transition-colors hover:border-primary/20 hover:bg-primary/10">
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/schedule-pickup">
              <Button>Book pickup</Button>
            </Link>
          </div>
        </section>

        <section className="container-wide pb-24">
          <SupportBand title="Still not sure where to go?" description="Use the main navigation for the polished route, or contact the team directly for help." />
        </section>
      </div>
    </AppLayout>
  );
}
