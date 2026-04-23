import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { LegalPage } from "@/components/site";

const sections = [
  {
    title: "What cookies do",
    body:
      "Cookies are small pieces of data stored by the browser to support login persistence, preferences, and website functionality.\nThey also help Fab Clean understand basic site usage patterns and improve the digital experience over time.",
  },
  {
    title: "Cookie categories",
    body:
      "Essential cookies support security, routing, and account-related functionality.\nPerformance or analytics cookies help evaluate page usage, interaction trends, and feature quality where enabled.",
  },
  {
    title: "Managing preferences",
    body:
      "Customers can adjust browser settings to block or clear cookies, although that may affect parts of the website or portal experience.\nBrowser-level controls remain the primary way to manage cookie behavior.",
  },
];

export default function CookiesPage() {
  return (
    <AppLayout>
      <SEO
        title="Cookie Policy | Fab Clean"
        description="How Fab Clean uses cookies and similar browser technologies."
        canonical="https://myfabclean.com/cookies"
      />
      <LegalPage
        title="Cookie Policy"
        description="Cookie information is now presented inside the same system as the rest of the site, without the extra custom UI baggage."
        effectiveDate="January 1, 2025"
        updatedDate="April 23, 2026"
        sections={sections}
      />
    </AppLayout>
  );
}
