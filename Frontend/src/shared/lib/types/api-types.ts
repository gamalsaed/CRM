/** Generic wrapper for every API response from the backend. */
export type ApiResponse<T> = {
  message?: string;
  status: string;
  data: T;
};

/** Subset of user fields returned by the auth endpoints. */
export type UserResponse = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "data entry" | "team leader";
};

/** Shape of the `data` field returned by the login endpoint. */
export type LoginResponse = {
  user: UserResponse;
  token: string;
};

export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "lost" | "problem" | "solved";