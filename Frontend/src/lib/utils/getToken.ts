"use server";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export default async function getMyToken() {
  const encodedToken = (await cookies()).get("next-auth.session-token")?.value;
  const token = await decode({
    token: encodedToken,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  return token?.token;
}
