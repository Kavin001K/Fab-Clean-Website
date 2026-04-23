import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { LegalPage } from "@/components/site";

const sections = [
  {
    title: "Service agreement",
    body:
      "These terms govern use of Fab Clean services across store visits, pickup and delivery, website interactions, and customer portal access.\nBy placing an order, the customer agrees to Fab Clean's current service terms, pricing approach, and handling procedures.",
  },
  {
    title: "Customer responsibilities",
    body:
      "Customers should remove valuables from garments, disclose existing defects when relevant, and provide accurate contact and address information.\nItems with missing labels, unstable dyes, or structural weaknesses may be subject to care limitations or additional review.",
  },
  {
    title: "Pricing and payment",
    body:
      "Published rates are starting prices and final billing may vary by garment type, condition, required treatment, and special handling.\nPayment terms, taxes, and service charges apply based on the live order and the current Fab Clean rate card.",
  },
  {
    title: "Liability and claims",
    body:
      "Fab Clean takes care in handling garments, but some material limitations, dye instability, or pre-existing issues may affect outcomes.\nClaims for damage or quality concerns should be raised promptly after delivery so the team can review the case fairly.",
  },
];

export default function TermsPage() {
  return (
    <AppLayout>
      <SEO
        title="Terms & Conditions | Fab Clean"
        description="The main service terms and operating expectations for Fab Clean customers."
        canonical="https://myfabclean.com/terms"
      />
      <LegalPage
        title="Terms & Conditions"
        description="The legal pages now match the editorial system instead of behaving like separate mini-sites with their own UI logic."
        effectiveDate="January 1, 2025"
        updatedDate="April 23, 2026"
        sections={sections}
      />
    </AppLayout>
  );
}
