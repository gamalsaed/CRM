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
