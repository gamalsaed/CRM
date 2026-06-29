"use server";

import getMyToken from "../utils/getToken";
import { User } from "../types/app-data.t";

/**
 * Fetches all users. An optional query string can be appended to filter
 * results (e.g. `role=team leader`).
 */
export async function getUsersAction(query?: string) {
  const token = await getMyToken();

  const url = query
    ? `${process.env.BASE_API}/users?${query}`
    : `${process.env.BASE_API}/users`;

  const res = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users!");
  }

  return await res.json();
}

/**
 * Fetches a single user by ID, or the current session user when no ID is
 * given. Returns null when the user is not found (invalid ObjectId or
 * "User not found!" message from the API).
 */
export async function getUserDetailsAction(id?: string) {
  const token = await getMyToken();

  const url = id
    ? `${process.env.BASE_API}/users/${id}`
    : `${process.env.BASE_API}/users/my-info`;

  const res = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();

  if (
    result.status === "fail" &&
    (result.message.includes("Cast to ObjectId failed for value") ||
      result.message === "User not found!")
  ) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch the user!");
  }

  return result;
}

type CreateUserParams = { confirmPassword: string; password: string } & Omit<
  User,
  "_id" | "createdAt" | "passwordChangedAt"
>;

/** Creates a new user account via the signup endpoint. */
export async function createUserAction(user: Partial<CreateUserParams>) {
  const token = await getMyToken();

  const res = await fetch(`${process.env.BASE_API}/auth/signup`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error("Failed to create the user!");
  }

  return await res.json();
}

type UpdateUserProps = Omit<User, "_id" | "createdAt" | "passwordChangedAt">;

/**
 * Updates a user's basic info fields. Strips undefined values before sending
 * so only changed fields are sent to the API.
 */
export async function updateUserAction(
  user: Partial<UpdateUserProps>,
  id: string,
) {
  const token = await getMyToken();

  if (!token) {
    throw new Error("No token found");
  }

  const cleanUser = Object.fromEntries(
    Object.entries(user).filter(([, value]) => value !== undefined),
  );

  const res = await fetch(`${process.env.BASE_API}/users/update-user/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanUser),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update the user!");
  }

  return data;
}

/** Updates the role of a user, which also changes their effective permissions. */
export async function updateUserRoleAction(userId: string, role: string) {
  const token = await getMyToken();
  const res = await fetch(
    `${process.env.BASE_API}/users/update-user-role/${userId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: role }),
    },
  );

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || "Failed to update the user role!");
  }

  return data;
}

type ChangePasswordParams = {
  newPassword: string;
  confirmPassword: string;
};

/**
 * Changes the password for a user. Admins can set a password directly
 * by providing only `newPassword` and `confirmPassword`.
 */
export async function changePasswordAction(
  data: ChangePasswordParams,
  userId: string,
) {
  const token = await getMyToken();

  const res = await fetch(
    `${process.env.BASE_API}/users/change-password/${userId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to change password!");
  }

  return result;
}

/**
 * Permanently deletes a user by ID. Parses the error body from both JSON and
 * plain-text responses to surface a meaningful error message.
 */
export async function deleteUserAction(userId: string): Promise<void> {
  const token = await getMyToken();

  const res = await fetch(`${process.env.BASE_API}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    return;
  }

  const contentType = res.headers.get("content-type");

  let message = "Failed to delete user!";

  if (contentType?.includes("application/json")) {
    const errorData = await res.json().catch(() => null);

    message = errorData?.message || message;
  } else {
    const errorText = await res.text().catch(() => "");

    message = errorText || message;
  }

  throw new Error(message);
}
