import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { FadeIn, SectionHeading, Button } from "@/components/ui";
import { StatStrip, StoryCard, SupportBand } from "@/components/site";
import { BRAND, BRANCHES, OPERATING_PILLARS, TRUST_STATS } from "@/lib/brand";

export default function About() {
  return (
    <AppLayout>
      <SEO
        title="About Fab Clean"
        description="Learn how Fab Clean blends premium garment care, transparent operations, and local service across Pollachi and Kinathukadavu."
        canonical="https://myfabclean.com/about"
      />

      <div className="page-shell">
        <section className="container-wide section-padding">
          <SectionHeading title="A premium local brand should feel disciplined online too." subtitle="About Fab Clean" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
            Fab Clean was built to bring structure, clarity, and dependable finishing to garment care in Pollachi and Kinathukadavu. The redesign keeps that positioning intact and expresses it with more restraint.
          </p>
          <div className="mt-12">
            <StatStrip stats={TRUST_STATS} />
          </div>
        </section>

        <section className="container-wide section-padding pt-4">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <FadeIn>
              <div className="visual-card min-h-[540px]">
                <img src={`${import.meta.env.BASE_URL}images/editorial-garment.svg`} alt="Fab Clean editorial garment care artwork" loading="lazy" />
              </div>
            </FadeIn>
            <div>
              <SectionHeading align="left" title="Built around transparency, convenience, and finish quality." subtitle="Positioning" />
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                The website now supports the same promise customers hear in-store: your garments are handled carefully, your status is visible, and the next action is always clear. The result is less friction for first-time visitors and more confidence for repeat customers.
              </p>
              <div className="mt-8 grid gap-5">
                {OPERATING_PILLARS.map((item, index) => (
                  <FadeIn key={item.title} delay={index * 0.05}>
                    <StoryCard {...item} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container-wide section-padding pt-4">
          <SectionHeading title="Two branches. One standard of presentation." subtitle="Locations" />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {BRANCHES.map((branch, index) => (
              <FadeIn key={branch.slug} delay={index * 0.05}>
                <div className="visual-card p-7">
                  <p className="eyebrow">{branch.title}</p>
                  <h3 className="mt-6 font-display text-3xl text-ink">{branch.title}</h3>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">{branch.address}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={branch.mapHref} target="_blank" rel="noreferrer">
                      <Button variant="outline">Get directions</Button>
                    </a>
                    <a href={BRAND.phoneHref}>
                      <Button variant="secondary">{branch.phone}</Button>
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="container-wide pb-24">
          <SupportBand title="Need a direct answer from the team?" description="Call or message Fab Clean for branch timing, pickup questions, or garment-specific guidance." />
        </section>
      </div>
    </AppLayout>
  );
}
