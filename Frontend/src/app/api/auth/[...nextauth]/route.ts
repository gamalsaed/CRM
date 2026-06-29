import NextAuth from "next-auth";
import { authOptions } from "@/auth";

/** NextAuth catch-all route handler for GET and POST requests. */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
