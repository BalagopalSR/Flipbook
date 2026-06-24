import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "flipbook_session";

export interface SessionUser {
  id: string;
  username: string;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || "flipbook-internal-dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ sub: user.id, username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.sub || typeof payload.username !== "string") return null;
    return { id: payload.sub, username: payload.username };
  } catch {
    return null;
  }
}
