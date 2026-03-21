import { SEO } from "@/components/seo";
import { AppLayout } from "@/components/layout";
import { SectionHeading, FadeIn, Card } from "@/components/ui";
import { Link } from "wouter";
import { 
  Home, List, Tag, Info, Phone, 
  User, UserPlus, Calendar, LayoutDashboard,
  Shield, Scale, Cookie, MapPin, ExternalLink
} from "lucide-react";

const sitemapGroups = [
  {
    title: "Main Navigation",
    links: [
      { name: "Home", path: "/", icon: Home, description: "Premium laundry & dry cleaning homepage." },
      { name: "Services", path: "/services", icon: List, description: "Explore our expert cleaning solutions." },
      { name: "Pricing", path: "/pricing", icon: Tag, description: "Affordable rates for luxury garment care." },
      { name: "About Us", path: "/about", icon: Info, description: "Our science, our story, and our mission." },
      { name: "Contact", path: "/contact", icon: Phone, description: "Get in touch with our Pollachi & Kinathukadavu hubs." },
    ]
  },
  {
    title: "Services & Bookings",
    links: [
      { name: "Schedule Pickup", path: "/schedule-pickup", icon: Calendar, description: "Book a free doorstep collection." },
      { name: "Our Locations", path: "/contact#locations", icon: MapPin, description: "Find our physical branches." },
    ]
  },
  {
    title: "Account & Portal",
    links: [
      { name: "Customer Login", path: "/login", icon: User, description: "Access your orders and profile." },
      { name: "Register", path: "/register", icon: UserPlus, description: "Join the Fab Clean community." },
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, description: "Manage your active cleaning orders." },
    ]
  },
  {
    title: "Legal & Privacy",
    links: [
      { name: "Privacy Policy", path: "#", icon: Shield, description: "How we protect your data." },
      { name: "Terms of Service", path: "#", icon: Scale, description: "Our service agreement." },
      { name: "Cookie Policy", path: "#", icon: Cookie, description: "Managing your website preferences." },
    ]
  }
];

export default function Sitemap() {
  return (
    <AppLayout>
      <SEO 
        title="Sitemap — Fab Clean" 
        description="Navigate through Fab Clean's premium dry cleaning and laundry services in Pollachi. Find all our pages, services, and policies in one place."
        canonical={`${window.location.origin}/sitemap`}
      />

      <section className="section-padding pt-40 pb-32">
        <div className="container-wide">
          <SectionHeading 
            title="Sitemap" 
            subtitle="Explore our Digital Hub" 
            align="left"
            className="mb-24"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {sitemapGroups.map((group, groupIndex) => (
              <FadeIn key={group.title} delay={groupIndex * 0.1}>
                <div className="space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary/60 border-l-4 border-primary pl-6 py-1">
                    {group.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {group.links.map((link) => (
                      <Link key={link.name} href={link.path}>
                        <Card className="p-6 hover:bg-white/50 transition-all group border-transparent hover:border-primary/10">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                              <link.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
                                  {link.name}
                                </span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">{link.description}</p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="pb-32">
        <div className="container-wide">
          <FadeIn delay={0.4}>
            <div className="bg-primary/5 rounded-[3.5rem] p-12 md:p-20 text-center border border-primary/10">
              <h2 className="text-3xl md:text-4xl font-black mb-6">Need help finding something?</h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                Our support team is available 9 AM – 8 PM to assist you with order tracking, 
                special fabric care queries, or pickup scheduling.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="tel:9363059595" className="px-10 py-5 bg-foreground text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  Call 93630 59595
                </a>
                <a href="https://wa.me/919363059595" target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  WhatsApp Support
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </AppLayout>
  );
}
