import { useEffect } from "react";
import { useLocation } from "wouter";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  image?: string;
  schema?: object;
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  type = "website", 
  image = "https://myfabclean.com/logo-og.jpg",
  schema
}: SEOProps) {
  const [location] = useLocation();
  const siteName = "Fab Clean — Pollachi's Premium Dry Cleaning & Laundry";
  const fullTitle = title === "Home" ? siteName : `${title} | Fab Clean Pollachi`;
  const url = `https://myfabclean.com${location}`;
  const finalCanonical = canonical || url;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // Update Canonical
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute("href", finalCanonical);
    }

    // Update Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", url);

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute("content", type);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", image);

    // Update Twitter
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", fullTitle);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute("content", description);

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute("content", image);

    // Handle Schema.org JSON-LD
    let scriptTag = document.getElementById("json-ld-schema");
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "json-ld-schema";
        scriptTag.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptTag);
      }
      scriptTag.innerHTML = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

  }, [fullTitle, description, finalCanonical, url, type, image, schema]);

  return null;
}
