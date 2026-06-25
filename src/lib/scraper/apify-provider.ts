import type { ScrapedProspect, ScraperProvider } from "./types";

// Raw subset of the Apify "Google Maps Scraper" (compass/crawler-google-places)
// dataset item shape we consume.
interface ApifyPlace {
  title?: string;
  phone?: string | null;
  categoryName?: string | null;
  totalScore?: number | null;
  reviewsCount?: number | null;
  address?: string | null;
  street?: string | null;
  city?: string | null;
  website?: string | null;
  url?: string | null;
  openingHours?: Array<{ day?: string; hours?: string }> | null;
  reviews?: Array<{ text?: string | null }> | null;
}

// Apify Google Maps adapter. Constructed only when APIFY_TOKEN is present (the
// factory in ./index.ts guards on that); never call it without a token.
export class ApifyScraperProvider implements ScraperProvider {
  readonly name = "apify";

  constructor(
    private readonly token: string,
    private readonly actorId: string = process.env.APIFY_ACTOR_ID ||
      "compass~crawler-google-places",
  ) {}

  async search(query: string): Promise<ScrapedProspect[]> {
    const endpoint =
      `https://api.apify.com/v2/acts/${this.actorId}` +
      `/run-sync-get-dataset-items?token=${encodeURIComponent(this.token)}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: [query],
        maxCrawledPlacesPerSearch: 20,
        language: "en",
      }),
    });

    if (!res.ok) {
      throw new Error(
        `Apify request failed: ${res.status} ${res.statusText}`,
      );
    }

    const items = (await res.json()) as ApifyPlace[];
    return items
      .map((p) => mapApifyPlace(p))
      .filter((p): p is ScrapedProspect => p !== null);
  }
}

function mapApifyPlace(p: ApifyPlace): ScrapedProspect | null {
  const businessName = p.title?.trim();
  const address =
    p.address?.trim() ||
    [p.street, p.city].filter(Boolean).join(", ").trim() ||
    "";
  if (!businessName || !address) return null;

  const hours = (p.openingHours ?? [])
    .map((h) => [h.day, h.hours].filter(Boolean).join(" "))
    .filter(Boolean)
    .join("; ");

  const topReviews = (p.reviews ?? [])
    .map((r) => r.text?.trim())
    .filter((t): t is string => Boolean(t))
    .slice(0, 3)
    .join(" | ");

  const website = p.website?.trim() || null;

  return {
    businessName,
    phone: p.phone?.trim() || null,
    category: p.categoryName?.trim() || "Local Business",
    rating: typeof p.totalScore === "number" ? p.totalScore : 0,
    reviewCount: typeof p.reviewsCount === "number" ? p.reviewsCount : 0,
    address,
    hours: hours || "Hours not listed",
    topReviews: topReviews || "No reviews captured",
    mapsUrl: p.url?.trim() || "",
    hasWebsite: Boolean(website),
    websiteUrl: website,
  };
}

