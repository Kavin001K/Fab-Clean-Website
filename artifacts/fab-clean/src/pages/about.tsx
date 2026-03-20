import { AppLayout } from "@/components/layout";
import { SectionHeading, FadeIn } from "@/components/ui";

export default function About() {
  return (
    <AppLayout>
      <div className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={`${import.meta.env.BASE_URL}images/pattern-bg.png`} alt="Pattern" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading 
            title="Our Story" 
            subtitle="About Fab Clean"
            className="mb-12"
          />

          <FadeIn className="prose prose-invert prose-lg max-w-none">
            <p className="lead text-xl text-white/90 font-medium">
              Founded in 2023 under Yadvik Traders, Fab Clean was born out of a simple necessity: providing truly premium, reliable, and expert garment care to Pollachi and Kinathukadavu.
            </p>
            
            <p className="text-muted-foreground">
              We recognized a gap in the local market for specialized cleaning — from delicate sarees and sherwanis to leather jackets and premium sneakers. Traditional methods often shorten the lifespan of high-quality fabrics. Our mission is to change that.
            </p>

            <blockquote className="border-l-4 border-primary pl-6 my-10 italic text-2xl font-display text-white">
              "We treat your clothes like our own — with care and precision."
            </blockquote>

            <h3 className="text-2xl font-display text-white mt-12 mb-6">Our Philosophy</h3>
            <p className="text-muted-foreground">
              It's not just about washing; it's about preservation. We employ a strict 6-stage process utilizing imported solvents, specialized machinery, and expert assessment. Whether it's everyday laundry by the KG or a heavily embellished bridal lehenga, the attention to detail remains uncompromising.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mt-16">
              <div className="p-8 rounded-2xl bg-card border border-white/5">
                <h4 className="text-primary font-bold text-xl mb-4">Pollachi Branch</h4>
                <p className="text-sm text-muted-foreground">
                  #16, Venkatramana Round Road<br/>
                  Opp Naturals / HDFC Bank<br/>
                  Mahalingapuram, Pollachi – 642002<br/>
                  <br/>
                  <strong className="text-white">Phone: 93630 59595</strong>
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-card border border-white/5">
                <h4 className="text-primary font-bold text-xl mb-4">Kinathukadavu Branch</h4>
                <p className="text-sm text-muted-foreground">
                  #442/11, Opp MLA Office<br/>
                  Krishnasamypuram<br/>
                  Kinathukadavu – 642109<br/>
                  <br/>
                  <strong className="text-white">Phone: 93637 19595</strong>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </AppLayout>
  );
}
