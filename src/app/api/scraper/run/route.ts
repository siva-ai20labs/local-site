import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { runScraper } from "@/lib/scraper";

export const dynamic = "force-dynamic";

const RunSchema = z.object({ query: z.string().max(200).optional() });

export async function POST(req: Request) {
  const guard = requireAdmin();
  if (!guard.ok) return guard.res;

  const body = await req.json().catch(() => ({}));
  const parsed = RunSchema.safeParse(body ?? {});
  const query = parsed.success ? parsed.data.query ?? "" : "";

  const result = await runScraper(query);
  const httpStatus = result.status === "success" ? 200 : 502;
  return NextResponse.json(result, { status: httpStatus });
}

