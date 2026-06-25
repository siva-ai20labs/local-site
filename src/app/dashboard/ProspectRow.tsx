"use client";

import { useState } from "react";
import type { ProspectDTO } from "@/lib/types";

interface Props {
  prospect: ProspectDTO;
  onBuilt: (updated: ProspectDTO) => void;
}

function StatusBadge({ prospect }: { prospect: ProspectDTO }) {
  if (prospect.hasWebsite) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        Has website
      </span>
    );
  }
  if (prospect.status === "site_built") {
    return (
      <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
        Site built
      </span>
    );
  }
  if (prospect.status === "build_failed") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
        Build failed
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      No website
    </span>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-700">{children}</dd>
    </div>
  );
}

export function ProspectRow({ prospect, onBuilt }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [building, setBuilding] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);

  const failed = buildError !== null || prospect.status === "build_failed";

  async function build() {
    setBuilding(true);
    setBuildError(null);
    try {
      const res = await fetch(`/api/prospects/${prospect.id}/build`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Build failed (HTTP ${res.status}).`);
      onBuilt(data.prospect as ProspectDTO);
    } catch (err) {
      setBuildError(err instanceof Error ? err.message : "Build failed");
    } finally {
      setBuilding(false);
    }
  }

  function renderAction() {
    if (prospect.hasWebsite && prospect.websiteUrl) {
      return (
        <a
          href={prospect.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Visit Site ↗
        </a>
      );
    }
    if (prospect.status === "site_built" && prospect.builtSiteUrl) {
      return (
        <a
          href={prospect.builtSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View Site ↗
        </a>
      );
    }
    if (building) {
      return (
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white opacity-80"
        >
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Building…
        </button>
      );
    }
    if (failed) {
      return (
        <button
          onClick={build}
          className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      );
    }
    return (
      <button
        onClick={build}
        className="inline-flex items-center rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        Build Site
      </button>
    );
  }

  return (
    <>
      <tr className="border-t border-slate-100 hover:bg-slate-50/60">
        <td className="py-3 pl-4 pr-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse details" : "Expand details"}
            aria-expanded={expanded}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <span className={`transition-transform ${expanded ? "rotate-90" : ""}`}>▶</span>
          </button>
        </td>
        <td className="py-3 pr-3">
          <div className="font-medium text-slate-900">{prospect.businessName}</div>
          <div className="text-xs text-slate-400">{prospect.address}</div>
        </td>
        <td className="py-3 pr-3 text-sm text-slate-600">{prospect.category}</td>
        <td className="py-3 pr-3 text-sm text-slate-600">
          {prospect.rating !== null ? `${prospect.rating.toFixed(1)} ★` : "—"}
        </td>
        <td className="py-3 pr-3 text-sm text-slate-600">{prospect.reviewCount ?? "—"}</td>
        <td className="py-3 pr-3">
          <StatusBadge prospect={prospect} />
        </td>
        <td className="py-3 pr-4 text-right">{renderAction()}</td>
      </tr>

      {expanded && (
        <tr className="border-t border-slate-100 bg-slate-50/70">
          <td />
          <td colSpan={6} className="px-3 py-4">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Phone">{prospect.phone || "Not listed"}</Detail>
              <Detail label="Hours">{prospect.hours || "Not listed"}</Detail>
              <Detail label="Rating">
                {prospect.rating !== null ? `${prospect.rating.toFixed(1)} ★` : "—"} ·{" "}
                {prospect.reviewCount ?? 0} reviews
              </Detail>
              <Detail label="Scrape source">
                {prospect.scrapeSource || "—"}
                {prospect.scrapedAt
                  ? ` · ${new Date(prospect.scrapedAt).toLocaleDateString()}`
                  : ""}
              </Detail>
              <Detail label="Maps">
                {prospect.mapsUrl ? (
                  <a
                    href={prospect.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    Open listing ↗
                  </a>
                ) : (
                  "—"
                )}
              </Detail>
              <Detail label="Website">
                {prospect.hasWebsite && prospect.websiteUrl ? (
                  <a
                    href={prospect.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    {prospect.websiteUrl}
                  </a>
                ) : prospect.builtSiteUrl ? (
                  <a
                    href={prospect.builtSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    {prospect.builtSiteUrl} (built)
                  </a>
                ) : (
                  "None yet"
                )}
              </Detail>
              <div className="sm:col-span-2 lg:col-span-3">
                <Detail label="Top reviews">{prospect.topReviews || "—"}</Detail>
              </div>
            </dl>
            {failed && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {buildError || "The last build attempt failed. Prospect data is intact — use Retry."}
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

