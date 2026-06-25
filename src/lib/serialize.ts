import type { Prospect } from "@prisma/client";
import type { ProspectDTO, ProspectStatus } from "./types";

// Converts a Prisma Prospect row into the plain JSON DTO the client consumes.
export function toProspectDTO(p: Prospect): ProspectDTO {
  const status: ProspectStatus =
    p.status === "site_built" || p.status === "build_failed"
      ? p.status
      : "new";
  return {
    id: p.id,
    businessName: p.businessName,
    phone: p.phone,
    category: p.category,
    rating: p.rating,
    reviewCount: p.reviewCount,
    address: p.address,
    hours: p.hours,
    topReviews: p.topReviews,
    mapsUrl: p.mapsUrl,
    hasWebsite: p.hasWebsite,
    websiteUrl: p.websiteUrl,
    builtSiteUrl: p.builtSiteUrl,
    status,
    scrapeSource: p.scrapeSource,
    scrapedAt: p.scrapedAt ? p.scrapedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

