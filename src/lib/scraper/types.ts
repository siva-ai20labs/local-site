import type { SeedProspect } from "../data/austin-leads";

// A normalized prospect record as returned by any scraper provider — the seed
// shape minus app-managed fields (builtSiteUrl/status are owned by the builder).
export type ScrapedProspect = Omit<SeedProspect, "builtSiteUrl" | "status">;

export interface ScraperProvider {
  // Stable identifier persisted as Prospect.scrapeSource ("seed" | "apify").
  readonly name: string;
  search(query: string): Promise<ScrapedProspect[]>;
}

