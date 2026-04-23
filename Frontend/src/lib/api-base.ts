export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim();

  if (!configured) {
    return "";
  }

  if (!configured.startsWith("http://") && !configured.startsWith("https://")) {
    return configured.replace(/\/api\/?$/, "");
  }

  const parsed = new URL(configured);
  parsed.pathname = parsed.pathname.replace(/\/api\/?$/, "") || "";
  return parsed.toString().replace(/\/$/, "");
}
