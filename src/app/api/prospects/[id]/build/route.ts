import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildSite } from "@/lib/site-builder/build";
import { toProspectDTO } from "@/lib/serialize";

export const dynamic = "force-dynamic";

// Synchronously builds a static site for a no-website prospect, writes the URL
// back, and flips status to site_built. On failure, marks build_failed WITHOUT
// losing prospect data, so the UI can offer Retry.
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const guard = requireAdmin();
  if (!guard.ok) return guard.res;

  const prospect = await prisma.prospect.findUnique({ where: { id: params.id } });
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
  }
  if (prospect.hasWebsite) {
    return NextResponse.json(
      { error: "Prospect already has a website" },
      { status: 409 },
    );
  }

  try {
    const { url } = await buildSite(prospect);
    const updated = await prisma.prospect.update({
      where: { id: prospect.id },
      data: { builtSiteUrl: url, status: "site_built" },
    });
    return NextResponse.json({ prospect: toProspectDTO(updated) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const updated = await prisma.prospect.update({
      where: { id: prospect.id },
      data: { status: "build_failed" },
    });
    return NextResponse.json(
      { error: message, prospect: toProspectDTO(updated) },
      { status: 500 },
    );
  }
}

