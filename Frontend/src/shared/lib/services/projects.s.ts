import { catchAsync } from "../utils/catchAsync";

export async function getProjects(token: string) {
  return catchAsync(async () => {
    const projectsApi = await fetch(`${process.env.BASE_API}/projects`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!projectsApi.ok) {
      throw new Error("Failed to fetch projects!");
    }

    return await projectsApi.json();
  });
}

export async function getProject(token: string) {
  return catchAsync(async () => {
    const projectsApi = await fetch(`${process.env.BASE_API}/projects`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!projectsApi.ok) {
      throw new Error("Failed to fetch projects!");
    }

    return await projectsApi.json();
  });
}
