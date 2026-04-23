import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { LegalPage } from "@/components/site";

const sections = [
  {
    title: "Information we collect",
    body:
      "Fab Clean collects the information needed to provide garment care and customer support. This includes name, phone number, email address, pickup and delivery details, order history, and service preferences.\nWe may also collect technical usage data such as browser, device, and session information when customers use the website.",
  },
  {
    title: "How we use information",
    body:
      "Personal information is used to process orders, coordinate pickup and delivery, send status updates, respond to customer questions, and maintain account access.\nWe may also use aggregated data to improve service quality, interface clarity, and operational reliability.",
  },
  {
    title: "Sharing and storage",
    body:
      "Fab Clean does not sell customer data. Information may be shared with service providers that support payments, communications, cloud hosting, delivery coordination, or legal compliance.\nData is retained only as long as necessary for business, support, and regulatory requirements.",
  },
  {
    title: "Customer rights",
    body:
      "Customers may request access to their information, ask for corrections, or raise deletion requests subject to legal retention requirements.\nPrivacy questions can be directed to the support channels published on the website.",
  },
];

export default function PrivacyPage() {
  return (
    <AppLayout>
      <SEO
        title="Privacy Policy | Fab Clean"
        description="How Fab Clean collects, uses, and protects customer information."
        canonical="https://myfabclean.com/privacy"
      />
      <LegalPage
        title="Privacy Policy"
        description="This version keeps the policy readable, structured, and easier to navigate while preserving the essential privacy commitments."
        effectiveDate="January 1, 2025"
        updatedDate="April 23, 2026"
        sections={sections}
      />
    </AppLayout>
  );
}
