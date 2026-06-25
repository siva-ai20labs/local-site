"use client";

import { useMemo, useState } from "react";
import type { SessionUser } from "@/lib/types";
import { LogoutButton } from "@/components/LogoutButton";
import { ProspectRow } from "./ProspectRow";
import { DEFAULT_FILTERS, useProspects, type ProspectFilters } from "./useProspects";

interface ScraperNotice {
  kind: "success" | "error";
  text: string;
}

export function Dashboard({ user }: { user: SessionUser }) {
  const [filters, setFilters] = useState<ProspectFilters>(DEFAULT_FILTERS);
  const [scraperQuery, setScraperQuery] = useState("");
  const [scraping, setScraping] = useState(false);
  const [notice, setNotice] = useState<ScraperNotice | null>(null);

  const { prospects, total, loading, error, refetch, patchProspect } =
    useProspects(filters);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of prospects) if (p.category) set.add(p.category);
    return Array.from(set).sort();
  }, [prospects]);

  async function runScraper() {
    setScraping(true);
    setNotice(null);
    try {
      const res = await fetch("/api/scraper/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: scraperQuery }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || `Scraper failed (HTTP ${res.status}).`);
      }
      setNotice({
        kind: "success",
        text: `Scraper [${data.provider}] found ${data.found} · ${data.inserted} new, ${data.updated} updated.`,
      });
      await refetch();
    } catch (err) {
      setNotice({
        kind: "error",
        text: err instanceof Error ? err.message : "Scraper failed",
      });
    } finally {
      setScraping(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">LocalSite AI — Prospects</h1>
          <p className="text-sm text-slate-500">
            Signed in as <span className="font-medium">{user.email}</span>
            <span className="ml-2 inline-flex rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
              {user.role}
            </span>
          </p>
        </div>
        <LogoutButton />
      </header>

      <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Scraper query
            </label>
            <input
              value={scraperQuery}
              onChange={(e) => setScraperQuery(e.target.value)}
              placeholder="e.g. plumbers in Leander TX"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            onClick={runScraper}
            disabled={scraping}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {scraping && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {scraping ? "Running…" : "Run Scraper"}
          </button>
        </div>
        {notice && (
          <p
            className={`mt-3 rounded-lg px-3 py-2 text-sm ${
              notice.kind === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {notice.text}
          </p>
        )}
      </section>

      <section className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          placeholder="Search name, category, address…"
          className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filters.hasWebsite}
          onChange={(e) =>
            setFilters((f) => ({ ...f, hasWebsite: e.target.value as ProspectFilters["hasWebsite"] }))
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Any website status</option>
          <option value="false">No website</option>
          <option value="true">Has website</option>
        </select>
        <select
          value={`${filters.sort}:${filters.dir}`}
          onChange={(e) => {
            const [sort, dir] = e.target.value.split(":");
            setFilters((f) => ({ ...f, sort, dir: dir === "asc" ? "asc" : "desc" }));
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="rating:desc">Rating (high → low)</option>
          <option value="rating:asc">Rating (low → high)</option>
          <option value="reviewCount:desc">Reviews (most first)</option>
          <option value="businessName:asc">Name (A → Z)</option>
          <option value="createdAt:desc">Newest</option>
        </select>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-xs text-slate-400">
          <span>
            {loading ? "Loading…" : `${total} prospect${total === 1 ? "" : "s"}`}
          </span>
        </div>

        {error ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              onClick={() => void refetch()}
              className="mt-3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3 px-4 py-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : prospects.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">No prospects yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Run the scraper or clear your filters to load prospects.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 pl-4 pr-2 font-semibold"> </th>
                  <th className="py-2 pr-3 font-semibold">Business</th>
                  <th className="py-2 pr-3 font-semibold">Category</th>
                  <th className="py-2 pr-3 font-semibold">Rating</th>
                  <th className="py-2 pr-3 font-semibold">Reviews</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 pr-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((p) => (
                  <ProspectRow key={p.id} prospect={p} onBuilt={patchProspect} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

