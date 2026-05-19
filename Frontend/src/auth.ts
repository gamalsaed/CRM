import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ApiResponse, LoginResponse } from "./shared/lib/types/api-types";

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
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        token.user = user.user;
        token.token = user.accessToken;
      }

      return token;
    },

    session: ({ session, token }) => {
      return {
        ...session,
        user: token.user,
      };
    },
  },
};
