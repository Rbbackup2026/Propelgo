
import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "propelgo_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getAuthKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be configured with a strong secret in .env.local",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSession(adminId: number) {
  const now = Math.floor(Date.now() / 1000);

  const token = await new SignJWT({
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(adminId))
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_DURATION_SECONDS)
    .sign(getAuthKey());

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getAdminSession(): Promise<{
  adminId: number;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getAuthKey(), {
      algorithms: ["HS256"],
    });

    const adminId = Number(payload.sub);

    if (
      payload.role !== "admin" ||
      !Number.isSafeInteger(adminId) ||
      adminId <= 0
    ) {
      return null;
    }

    return { adminId };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin");
  }

  return session;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
