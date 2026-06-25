"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProspectDTO } from "@/lib/types";

export interface ProspectFilters {
  q: string;
  category: string;
  hasWebsite: "" | "true" | "false";
  sort: string;
  dir: "asc" | "desc";
}

export const DEFAULT_FILTERS: ProspectFilters = {
  q: "",
  category: "",
  hasWebsite: "",
  sort: "rating",
  dir: "desc",
};

interface ProspectsResponse {
  prospects: ProspectDTO[];
  total: number;
}

interface ProspectsState {
  prospects: ProspectDTO[];
  total: number;
  loading: boolean;
  error: string | null;
}

export interface UseProspects extends ProspectsState {
  refetch: () => Promise<void>;
  patchProspect: (updated: ProspectDTO) => void;
}

// Owns prospect list fetching keyed off the active filters. Exposes refetch (for
// after a scraper run) and patchProspect (in-place update after a site build).
export function useProspects(filters: ProspectFilters): UseProspects {
  const [state, setState] = useState<ProspectsState>({
    prospects: [],
    total: 0,
    loading: true,
    error: null,
  });

  const fetchProspects = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.category) params.set("category", filters.category);
    if (filters.hasWebsite) params.set("hasWebsite", filters.hasWebsite);
    params.set("sort", filters.sort);
    params.set("dir", filters.dir);
    params.set("pageSize", "100");
    try {
      const res = await fetch(`/api/prospects?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.status === 403) {
        throw new Error("Admin access required (403).");
      }
      if (!res.ok) {
        throw new Error(`Failed to load prospects (HTTP ${res.status}).`);
      }
      const data = (await res.json()) as ProspectsResponse;
      setState({
        prospects: data.prospects,
        total: data.total,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        prospects: [],
        total: 0,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, [filters.q, filters.category, filters.hasWebsite, filters.sort, filters.dir]);

  useEffect(() => {
    void fetchProspects();
  }, [fetchProspects]);

  const patchProspect = useCallback((updated: ProspectDTO) => {
    setState((s) => ({
      ...s,
      prospects: s.prospects.map((p) => (p.id === updated.id ? updated : p)),
    }));
  }, []);

  return { ...state, refetch: fetchProspects, patchProspect };
}

