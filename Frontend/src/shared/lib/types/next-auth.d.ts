import { User } from "next-auth";
import { UserResponse } from "./api-types";

/**
 * Module augmentation to extend NextAuth's built-in types with the backend
 * API token and user profile so they are available on the session object.
 */
declare module "next-auth" {
  interface User {
    accessToken: string;
    user: UserResponse;
  }

  interface Session {
    user: User["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface JWT extends User {}
}
