"use server";
import getMyToken from "../utils/getToken";

export async function assignLeadsAction(
  id: string,
  leads: string[],
  target: "project" | "user",
) {
  if (!id || leads.length < 1) {
    throw new Error("Please select Leads and user");
  }
  const token = await getMyToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${process.env.BASE_API}/leads/${target === "user" ? "assign-to-user" : "assign-to-project"}/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ leads }),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to assign leads to ${target}`);
  }

  return res.json();
}

export async function deleteLead(id: string) {
  const token = await getMyToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.BASE_API}/leads/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete lead`);
  }

  return res.json();
}
