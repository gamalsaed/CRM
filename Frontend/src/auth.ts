import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ApiResponse, LoginResponse } from "./shared/lib/types/api-types";

/**
 * NextAuth configuration. Uses the credentials provider to authenticate
 * against the backend API and stores the JWT token in the session.
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      /**
       * Validates credentials against the backend API.
       * Throws an error if the response status is not "success".
       */
      authorize: async (credentials) => {
        const response = await fetch(`${process.env.BASE_API}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const payload: ApiResponse<LoginResponse> = await response.json();

        if (payload.status !== "success") {
          throw new Error(payload.message);
        }

        return {
          id: payload.data.user._id,
          accessToken: payload.data.token,
          user: payload.data.user,
        };
      },
    }),
  ],

  callbacks: {
    /** Persists the backend API token and user profile into the JWT. */
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        token.user = user.user;
        token.token = user.accessToken;
      }

      return token;
    },

    /** Exposes the user profile from the JWT on the session object. */
    session: ({ session, token }) => {
      return {
        ...session,
        user: token.user,
      };
    },
  },
};
