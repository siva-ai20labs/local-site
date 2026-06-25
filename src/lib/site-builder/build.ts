import { promises as fs } from "fs";
import path from "path";
import { renderSiteHtml, type SiteProspect } from "./template";

// URL-safe slug from a business name. Bounded length; always non-empty.
export function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritical marks
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "site";
}

// Repo-root sites directory (matches the committed sites/<slug>/ convention).
// process.cwd() is the app root where `next` runs.
export function sitesDir(): string {
  return path.join(process.cwd(), "sites");
}

export interface BuildResult {
  slug: string;
  url: string;
}

// Synchronously generates a static site under sites/<slug>/index.html.
// Kept as an isolated async unit so it can move to a queue/worker later without
// touching callers.
export async function buildSite(prospect: SiteProspect): Promise<BuildResult> {
  const slug = slugify(prospect.businessName);
  const dir = path.join(sitesDir(), slug);
  await fs.mkdir(dir, { recursive: true });
  const html = renderSiteHtml(prospect);
  await fs.writeFile(path.join(dir, "index.html"), html, "utf8");
  return { slug, url: `/sites/${slug}/` };
}

