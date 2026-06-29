"use server";
import getMyToken from "../utils/getToken";
import { LeadFormValues, UpdateLeadValues } from "../schemas/leads.s";

/**
 * Assigns a list of leads to either a user or a project.
 * @param id - The target user or project ID.
 * @param leads - Array of lead IDs to assign.
 * @param target - Whether to assign to a "user" or "project".
 */
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

/**
 * Permanently deletes a single lead by ID.
 * Returns null for 204 No Content responses.
 */
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

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export async function createLeadsAction(leads: LeadFormValues[]) {
  const token = await getMyToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.BASE_API}/leads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ leads }),
  });

  const result = await res.json();

  if (!res.ok) {
    const errorMsg =
      result?.message &&
      result.message.includes("duplicate") &&
      "Dosen't accept duplicates";
    throw new Error(
      errorMsg || result?.message || "failed to create these leads",
    );
  }

  return result;
}

export async function getLead(id: string) {
  const token = await getMyToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const statusApi = await fetch(`${process.env.BASE_API}/leads/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await statusApi.json();
  if (data.status === "fail") {
    throw new Error(data?.message || "Something went wrong try again later");
  }

  if (!statusApi.ok) {
    throw new Error("Failed to get the lead");
  }

  return data;
}

export async function addNoteAction(note: string, id: string) {
  const token = await getMyToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.BASE_API}/leads/${id}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ note }),
  });

  const data = await res.json();
  if (data.status === "fail") {
    throw new Error(data?.message || "Something went wrong try again later");
  }

  if (!res.ok) {
    throw new Error("Failed to post the note");
  }

  return data;
}

export async function deleteNoteAction(noteId: string, leadId: string) {
  const token = await getMyToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${process.env.BASE_API}/leads/${leadId}/notes/${noteId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.status === 204) {
    return null;
  }
  const data = await res.json();

  if (data.status === "fail") {
    throw new Error(data?.message || "Something went wrong try again later");
  }

  if (!res.ok) {
    throw new Error("Failed to delete the note");
  }
}

type UpdateLeadParams = {
  body: Partial<UpdateLeadValues>;
  leadId: string;
};

export async function updateLeadAction({ body, leadId }: UpdateLeadParams) {
  const token = await getMyToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.BASE_API}/leads/${leadId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.status === "fail") {
    throw new Error(data?.message || "Something went wrong try again later");
  }

  if (!res.ok) {
    throw new Error("Failed to post the note");
  }

  return data;
}
