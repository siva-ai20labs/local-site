import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Serves the customer-facing static sites generated under repo-root sites/<slug>/.
// Public by design (these are the live business websites). Hardened against path
// traversal; directory requests fall through to index.html.
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

export async function GET(
  _req: Request,
  { params }: { params: { slug: string[] } },
) {
  const segments = (params.slug ?? []).filter((s) => s.length > 0);
  if (
    segments.some(
      (s) => s === "." || s === ".." || s.includes("/") || s.includes("\\") || s.includes("\0"),
    )
  ) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const root = path.join(process.cwd(), "sites");
  const resolved = path.resolve(root, ...segments);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const stat = await fs.stat(resolved).catch(() => null);
    const filePath = !stat || stat.isDirectory() ? path.join(resolved, "index.html") : resolved;
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const type = CONTENT_TYPES[ext] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: { "content-type": type, "cache-control": "no-store" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

