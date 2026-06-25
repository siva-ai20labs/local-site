// Stateless, HMAC-signed session tokens stored in an httpOnly cookie.
// Format: `<base64url(payload)>.<base64url(hmac-sha256)>`.
// No external session store needed for the POC; swappable for JWT/DB later.

import { createHmac, timingSafeEqual } from "crypto";
import type { Role } from "./types";

export const SESSION_COOKIE = "ls_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export interface SessionPayload {
  userId: string;
  role: Role;
  exp: number; // unix seconds
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 8) {
    // Fail loud in production: an unsigned/weakly-signed session is a security hole.
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET is not set (or too short) in production");
    }
    return "dev-insecure-secret-change-me";
  }
  return s;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(userId: string, role: Role): string {
  const payload: SessionPayload = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(
  token: string | undefined | null,
): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body);
  const given = Buffer.from(sig);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (
      typeof payload.userId !== "string" ||
      (payload.role !== "admin" && payload.role !== "user") ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

