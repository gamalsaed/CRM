"use server";

import getMyToken from "../utils/getToken";

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
