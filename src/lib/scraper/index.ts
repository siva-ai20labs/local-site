import { prisma } from "../db";
import { ApifyScraperProvider } from "./apify-provider";
import { SeedScraperProvider } from "./seed-provider";
import type { ScraperProvider } from "./types";

// Provider selection: use Apify when a token is configured, otherwise fall back
// to the built-in seed/mock dataset. Never instantiates Apify without a key.
export function getScraperProvider(): ScraperProvider {
  const token = process.env.APIFY_TOKEN?.trim();
  if (token) return new ApifyScraperProvider(token);
  return new SeedScraperProvider();
}

export interface ScraperRunResult {
  runId: string;
  provider: string;
  status: "success" | "failed";
  found: number;
  inserted: number;
  updated: number;
  message?: string;
}

// Runs the active provider, upserts results (dedup on businessName+address), and
// always writes a scraper_runs log row — success or failure.
export async function runScraper(query: string): Promise<ScraperRunResult> {
  const provider = getScraperProvider();
  let found = 0;
  let inserted = 0;
  let updated = 0;

  try {
    const results = await provider.search(query);
    found = results.length;

    for (const r of results) {
      const key = {
        businessName_address: {
          businessName: r.businessName,
          address: r.address,
        },
      };
      const existing = await prisma.prospect.findUnique({ where: key });
      await prisma.prospect.upsert({
        where: key,
        create: {
          businessName: r.businessName,
          phone: r.phone,
          category: r.category,
          rating: r.rating,
          reviewCount: r.reviewCount,
          address: r.address,
          hours: r.hours,
          topReviews: r.topReviews,
          mapsUrl: r.mapsUrl,
          hasWebsite: r.hasWebsite,
          websiteUrl: r.websiteUrl,
          scrapeSource: provider.name,
          scrapedAt: new Date(),
          status: "new",
        },
        update: {
          // Refresh scraped fields but never clobber builder-owned state
          // (builtSiteUrl / status).
          phone: r.phone,
          category: r.category,
          rating: r.rating,
          reviewCount: r.reviewCount,
          hours: r.hours,
          topReviews: r.topReviews,
          mapsUrl: r.mapsUrl,
          hasWebsite: r.hasWebsite,
          websiteUrl: r.websiteUrl,
          scrapeSource: provider.name,
          scrapedAt: new Date(),
        },
      });
      if (existing) updated += 1;
      else inserted += 1;
    }

    const run = await prisma.scraperRun.create({
      data: { provider: provider.name, query, status: "success", found, inserted, updated },
    });
    return { runId: run.id, provider: provider.name, status: "success", found, inserted, updated };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const run = await prisma.scraperRun.create({
      data: { provider: provider.name, query, status: "failed", found, inserted, updated, message },
    });
    return {
      runId: run.id,
      provider: provider.name,
      status: "failed",
      found,
      inserted,
      updated,
      message,
    };
  }
}

