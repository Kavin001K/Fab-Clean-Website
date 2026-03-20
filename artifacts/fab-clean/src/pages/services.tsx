import { AppLayout } from "@/components/layout";
import { SectionHeading, Card, FadeIn, Button } from "@/components/ui";
import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Services() {
  const { data, isLoading } = useListServices();

  return (
    <AppLayout>
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Our Services" 
          subtitle="Premium Care Catalog"
          className="mb-16"
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.data.map((service, i) => (
              <FadeIn key={service.id} delay={i * 0.1}>
                <Card className="h-full flex flex-col p-8 border-border hover:border-primary/40 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      <img src={`https://api.dicebear.com/7.x/icons/svg?seed=${service.icon}&backgroundColor=transparent`} alt="icon" className="w-8 h-8 opacity-80" />
                    </div>
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Starts ₹{service.startingPrice}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-grow leading-relaxed">{service.description}</p>

                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/schedule-pickup">
                    <Button className="w-full bg-lime-gradient text-primary-foreground hover:opacity-90">Book Now</Button>
                  </Link>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
