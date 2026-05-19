"use server";
import getMyToken from "../utils/getToken";

export async function getUsersAction() {
  // api/v1/users/
  const token = await getMyToken();

  const res = await fetch(`${process.env.BASE_API}/users`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Users!");
  }

  return await res.json();
}
