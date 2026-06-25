// Server-side auth helpers. Role is enforced here on every protected request
// — frontend guards are cosmetic only.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "./db";
import {
  SESSION_COOKIE,
  verifySessionToken,
  type SessionPayload,
} from "./session";
import type { Role, SessionUser } from "./types";

export function readSession(): SessionPayload | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = readSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return null;
  return { id: user.id, email: user.email, role: user.role as Role };
}

export type AdminGuard =
  | { ok: true; session: SessionPayload }
  | { ok: false; res: NextResponse };

// Returns a 401 (unauthenticated) or 403 (authenticated non-admin) response when
// the caller is not an admin. The session token is server-signed, so its role
// claim is trustworthy.
export function requireAdmin(): AdminGuard {
  const session = readSession();
  if (!session) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (session.role !== "admin") {
    return {
      ok: false,
      res: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { ok: true, session };
}

