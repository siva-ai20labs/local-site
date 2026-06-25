import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toProspectDTO } from "@/lib/serialize";

export const dynamic = "force-dynamic";

function parsePositiveInt(value: string | null, fallback: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(Math.floor(n), max);
}

export async function GET(req: Request) {
  const guard = requireAdmin();
  if (!guard.ok) return guard.res;

  const url = new URL(req.url);
  const page = parsePositiveInt(url.searchParams.get("page"), 1, 100000);
  const pageSize = parsePositiveInt(url.searchParams.get("pageSize"), 20, 100);
  const q = (url.searchParams.get("q") ?? "").trim();
  const category = (url.searchParams.get("category") ?? "").trim();
  const hasWebsiteParam = url.searchParams.get("hasWebsite");
  const sort = url.searchParams.get("sort") ?? "rating";
  const dir: "asc" | "desc" = url.searchParams.get("dir") === "asc" ? "asc" : "desc";

  const and: Prisma.ProspectWhereInput[] = [];
  if (q) {
    and.push({
      OR: [
        { businessName: { contains: q } },
        { category: { contains: q } },
        { address: { contains: q } },
      ],
    });
  }
  if (category) and.push({ category });
  if (hasWebsiteParam === "true" || hasWebsiteParam === "false") {
    and.push({ hasWebsite: hasWebsiteParam === "true" });
  }
  const where: Prisma.ProspectWhereInput = and.length ? { AND: and } : {};

  const orderBy: Prisma.ProspectOrderByWithRelationInput =
    sort === "reviewCount"
      ? { reviewCount: dir }
      : sort === "businessName"
        ? { businessName: dir }
        : sort === "createdAt"
          ? { createdAt: dir }
          : sort === "status"
            ? { status: dir }
            : { rating: dir };

  const [total, rows] = await Promise.all([
    prisma.prospect.count({ where }),
    prisma.prospect.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    prospects: rows.map(toProspectDTO),
  });
}

