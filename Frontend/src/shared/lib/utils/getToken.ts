"use server";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

/**
 * Reads and decodes the NextAuth session cookie to extract the raw API token.
 * Must only be called from Server Components or Server Actions.
 */
export default async function getMyToken() {
  const cookieStore = await cookies();

  const encodedToken =
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    cookieStore.get("next-auth.session-token")?.value;

  const token = await decode({
    token: encodedToken,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  return token?.token;
}
