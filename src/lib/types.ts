// Shared TypeScript contracts for the admin dashboard.

export type Role = "admin" | "user";

export const ROLES: Role[] = ["admin", "user"];

export function isRole(value: string): value is Role {
  return value === "admin" || value === "user";
}

// Prospect lifecycle status.
export type ProspectStatus = "new" | "site_built" | "build_failed";

// Plain-serializable prospect shape returned by the API (Dates as ISO strings).
export interface ProspectDTO {
  id: string;
  businessName: string;
  phone: string | null;
  category: string | null;
  rating: number | null;
  reviewCount: number | null;
  address: string | null;
  hours: string | null;
  topReviews: string | null;
  mapsUrl: string | null;
  hasWebsite: boolean;
  websiteUrl: string | null;
  builtSiteUrl: string | null;
  status: ProspectStatus;
  scrapeSource: string | null;
  scrapedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  role: Role;
}

