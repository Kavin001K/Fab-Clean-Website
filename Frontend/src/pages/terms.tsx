import { AppLayout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { LegalPage } from "@/components/site";

const sections = [
  {
    title: "Stain removal & garment care",
    body:
      "We take utmost care to remove stains without damaging garments. We do not guarantee complete removal of stubborn as well as old stains.\nWe will treat all garments with extreme care. We cannot guarantee against color loss, bleeding, shrinkage, or damage to weak and tender fabrics during process.\nIf special instructions or delicate garments are there, the customer should inform at the time of booking. Otherwise the store is not responsible for damage or color bleed.\nWe will undertake the cleaning of the garments in the best possible manner that our technicians deem fit. The various cleaning methods deployed by us will vary from wash in emulsifier, detergent and softeners, to soft wash for delicate garments.",
  },
  {
    title: "Pickup & delivery",
    body:
      "Pick up and drop facility is available only within a 3 km radius from the store for a minimum order value of Rs 500 and above. This service availability depends on delivery.\nEvery effort is made to deliver the clothes on time. However, due to unforeseen circumstances, labor problems, or power issues, the delivery time may be delayed.\nUrgent delivery of garments will be charged at 50% extra and will be delivered within 48 hours (Express Delivery).",
  },
  {
    title: "Quality, inspection & reprocessing",
    body:
      "In case of any unsatisfactory quality, the order tags need to be intact and garments should be in unused condition. After inspection only, the garment is taken for free reprocess.\nCustomers are requested to check and examine the clothes at the time of delivery. Complaints or any loss will not be entertained after 48 hours from the date of delivery.\nCustomers are advised to remove all packing covers within a day after receiving garments from the store. Fungus may occur due to moisture in the environment. Hence the store is not responsible and will not reprocess for the same.",
  },
  {
    title: "Liability & risk",
    body:
      "The store shall not be liable for damage or color bleed during laundry service (wash by per kg/pcs).\nArticles with embroidery work, color threads, plastic beads, metal objects, stones, or dyeing clothes are accepted only at the risk of the customer.\nOld or weak silk sarees, sarees, and dhotis may tear or get damaged at the time of dry cleaning, for which the store is not responsible. This may be caused by fungus, which reduces the strength of the fiber or cloth.\nAt the time of processing, long-time sweat stains may spread throughout the fabric in different colors or shades. The company may not be responsible for the same.\nThe store is not responsible for customers' old or delicate clothes for any damages incurred at the time of starching, ironing, processing, or drying.\nLeather shoes may change color or shade after cleaning. The store is not responsible for the same.\nAll garments for laundry and dry cleaning are accepted only at customer risk.",
  },
  {
    title: "Loss, damage & collection",
    body:
      "In case of any unfortunate event of loss or damage of any garments, a maximum of 5 times compensation of those particular garments as mentioned in the bill would be reimbursed in terms of laundry or dry clean vouchers. No cash demand will be entertained.\nWe will not be responsible for maintenance of clothes if the garments are not collected within 30 days from the scheduled delivery date.",
  },
  {
    title: "Pricing, refunds & promotions",
    body:
      "Our prices may change from time to time depending on raw material price hikes or labor wage hikes.\nOur prices may vary from store to store and city to city.\nThe tariff of garments will be decided on a case-to-case basis depending on the complexity of the garments. The rates mentioned in the price list are indicative and minimal.\nOnce services have been availed, no request for refunds would be entertained.\nWe may use the images of your clothes for promotional purposes.",
  },
];

export default function TermsPage() {
  return (
    <AppLayout>
      <SEO
        title="Terms & Conditions | Fab Clean"
        description="Official service terms and conditions for Fab Clean laundry and dry cleaning customers."
        canonical="https://myfabclean.com/terms"
      />
      <LegalPage
        title="Terms & Conditions"
        description="Please read these terms carefully before using Fab Clean laundry and dry cleaning services."
        effectiveDate="January 1, 2025"
        updatedDate="July 19, 2026"
        sections={sections}
      />
    </AppLayout>
  );
}
