export type ApiResponse<T> = {
  message?: string;
  status: string;
  data: T;
};

export type UserResponse = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "data entry" | "team leader";
};

export type LoginResponse = {
  user: UserResponse;
  token: string;
};
