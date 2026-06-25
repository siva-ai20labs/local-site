import { AUSTIN_LEADS } from "../data/austin-leads";
import type { ScrapedProspect, ScraperProvider } from "./types";

// Default provider: serves the curated Austin Leads dataset, optionally filtered
// by a free-text query against business name / category / address. Used whenever
// APIFY_TOKEN is not configured.
export class SeedScraperProvider implements ScraperProvider {
  readonly name = "seed";

  async search(query: string): Promise<ScrapedProspect[]> {
    const rows: ScrapedProspect[] = AUSTIN_LEADS.map(
      ({ builtSiteUrl: _builtSiteUrl, status: _status, ...rest }) => rest,
    );
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      `${r.businessName} ${r.category} ${r.address}`.toLowerCase().includes(q),
    );
  }
}

