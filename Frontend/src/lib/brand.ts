import {
  CheckCircle2,
  Clock3,
  Footprints,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";

export const BRAND = {
  name: "Fab Clean",
  legalName: "Yadvik Traders",
  phoneMain: "93630 59595",
  phoneSecondary: "93637 19595",
  phoneHref: "tel:+919363059595",
  whatsappHref:
    "https://wa.me/919363059595?text=Hi%2C%20I%27d%20like%20to%20book%20a%20Fab%20Clean%20pickup.",
  email: "info@myfabclean.in",
  emailAlt: "myfabclean@gmail.com",
  hours: "Mon to Sat, 10:00 AM to 8:00 PM",
  heroTitle: "Premium garment care for wardrobes that should arrive flawless.",
  heroLead:
    "Fab Clean brings polished laundry, dry cleaning, and specialty care to Pollachi and Kinathukadavu with free pickup, clear communication, and precise finishing.",
  shortBlurb:
    "Premium laundry and dry cleaning with free pickup, clear pricing, and a cleaner customer experience.",
};

export const BRANCHES = [
  {
    slug: "pollachi",
    title: "Pollachi flagship",
    address:
      "#16, Venkatramana Round Road, Opposite Naturals Salon / HDFC Bank, Mahalingapuram, Pollachi - 642002",
    phone: BRAND.phoneMain,
    mapHref:
      "https://www.google.com/maps/search/?api=1&query=16%20Venkatramana%20Round%20Road%20Pollachi%20642002",
  },
  {
    slug: "kinathukadavu",
    title: "Kinathukadavu branch",
    address:
      "#442/11, Opposite MLA Office, Krishnasamypuram, Kinathukadavu - 642109",
    phone: BRAND.phoneSecondary,
    mapHref:
      "https://www.google.com/maps/search/?api=1&query=442%2F11%20Krishnasamypuram%20Kinathukadavu%20642109",
  },
] as const;

export const TRUST_STATS = [
  { value: "2023", label: "Established" },
  { value: "2", label: "Branches" },
  { value: "48h", label: "Fast turnaround" },
  { value: "3km", label: "Free pickup radius" },
];

export const SERVICE_HIGHLIGHTS: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Premium laundry",
    description: "Wash, steam, fold, and hand-finish for daily wear that still needs a refined result.",
    icon: WashingMachine,
  },
  {
    title: "Dry cleaning",
    description: "Structured care for sarees, suits, lehengas, and garments that do not belong in a standard cycle.",
    icon: Sparkles,
  },
  {
    title: "Shoe and bag care",
    description: "Targeted restoration for sneakers, leather shoes, handbags, and accessories that need extra attention.",
    icon: Footprints,
  },
];

export const OPERATING_PILLARS: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Transparent process",
    description: "Order tracking and clear status updates keep customers informed from pickup to delivery.",
    icon: ShieldCheck,
  },
  {
    title: "Reliable turnaround",
    description: "A disciplined intake-to-finishing flow helps keep delivery promises realistic and consistent.",
    icon: Clock3,
  },
  {
    title: "Doorstep convenience",
    description: "Free pickup and delivery within the supported radius reduces friction for repeat customers.",
    icon: Truck,
  },
];

export const PROCESS_STEPS: Array<{
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    step: "01",
    title: "Book pickup",
    description: "Share your items, branch, and preferred time in a short mobile-first flow.",
    icon: MapPin,
  },
  {
    step: "02",
    title: "Clean with care",
    description: "Garments move through the right cleaning method, finishing, and inspection path.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Track and receive",
    description: "Follow progress online and receive your order back ready to wear.",
    icon: CheckCircle2,
  },
];

export const LEGAL_NAV = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund", href: "/refund" },
  { label: "Cookies", href: "/cookies" },
];
