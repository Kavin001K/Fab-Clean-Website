import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { LegalPage } from "@/components/site";

const sections = [
  {
    title: "When refunds may apply",
    body:
      "Refunds or credits may be considered when service is not performed, billing is incorrect, or a verified quality issue requires remediation.\nFab Clean reviews each case based on the order record, service details, and the timing of the complaint.",
  },
  {
    title: "When refunds may not apply",
    body:
      "Refunds generally do not apply to pre-existing damage, normal wear, unstable dyes, undeclared garment issues, or service already completed as agreed.\nSome cases may be resolved through re-cleaning, adjustments, or operational review instead of a direct refund.",
  },
  {
    title: "How to raise a request",
    body:
      "Customers should report issues quickly after delivery and keep the order identifier available for review.\nThe Fab Clean team may request photos, garment details, or pickup references before final resolution.",
  },
];

export default function RefundPage() {
  return (
    <AppLayout>
      <SEO
        title="Refund Policy | Fab Clean"
        description="Fab Clean's refund and issue-resolution policy for garment care services."
        canonical="https://myfabclean.com/refund"
      />
      <LegalPage
        title="Refund Policy"
        description="The refund page now communicates the essentials cleanly instead of reading like a separate product."
        effectiveDate="January 1, 2025"
        updatedDate="April 23, 2026"
        sections={sections}
      />
    </AppLayout>
  );
}
