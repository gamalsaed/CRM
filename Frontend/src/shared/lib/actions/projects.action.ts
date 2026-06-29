"use server";

import getMyToken from "../utils/getToken";

/** Fetches all projects accessible to the current user. */
export async function getProjectsAction() {
  const token = await getMyToken();

  const projectsApi = await fetch(`${process.env.BASE_API}/projects`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!projectsApi.ok) {
    throw new Error("Failed to fetch projects!");
  }

  return await projectsApi.json();
}

/**
 * Creates or updates a project depending on the `method` parameter.
 * POST creates a new project; PATCH updates the project matching `id`.
 */
export async function handleProjectFormAction({
  name,
  description,
  method,
  id,
}: {
  name?: string;
  description?: string;
  method: "POST" | "PATCH";
  id?: string;
}) {
  const token = await getMyToken();

  const url =
    method === "POST"
      ? `${process.env.BASE_API}/projects/`
      : `${process.env.BASE_API}/projects/${id}`;

  const projectsApi = await fetch(url, {
    method,
    body: JSON.stringify({ name: name, description: description }),
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await projectsApi.json();
  if (!projectsApi.ok) {
    throw new Error("Failed to create projects!");
  }

  return result;
}

/**
 * Adds one or more users to a project's team.
 * @param projectId - The project to update.
 * @param userIds - Array of user IDs to add.
 */
export async function addUsersToProjectAction(
  projectId: string,
  userIds: string[],
) {
  const token = await getMyToken();

  const res = await fetch(
    `${process.env.BASE_API}/projects/${projectId}/add-user`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: userIds }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to assign users to project!");
  }

  return await res.json();
}

/**
 * Removes a single user from a project's team.
 * @param projectId - The project to update.
 * @param userId - The user to remove.
 */
export async function removeUserFromProjectAction(
  projectId: string,
  userId: string,
) {
  const token = await getMyToken();

  const res = await fetch(
    `${process.env.BASE_API}/projects/${projectId}/remove-user`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: [userId] }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to remove user from project!");
  }

  return await res.json();
}

/**
 * Permanently deletes a project by ID.
 * Returns null for 204 No Content responses.
 */
export async function deleteProjectAction(id: string) {
  const token = await getMyToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.BASE_API}/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete project`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}
