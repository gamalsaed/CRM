"use server";

import { catchAsync } from "../utils/catchAsync";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import getMyToken from "../utils/getToken";

export async function getProjects(token: string) {
  const session = await getServerSession(authOptions);
  return catchAsync(async () => {
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const endpoint =
      session?.user.role === "admin" ? "/projects" : "/projects/my-projects";
    const projectsApi = await fetch(`${process.env.BASE_API}${endpoint}`, {
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

export async function getProject(token: string, projectId: string) {
  return catchAsync(async () => {
    const projectApi = await fetch(
      `${process.env.BASE_API}/projects/${projectId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );

    if (!projectApi.ok) {
      throw new Error("Failed to fetch the project!");
    }

    return await projectApi.json();
  });
}

// Assign Leader "/:projectId/:userId"
export async function assignTeamLeaderAction(
  projectId: string,
  userId: string,
) {
  const token = await getMyToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  return catchAsync(async () => {
    const projectApi = await fetch(
      `${process.env.BASE_API}/projects/${projectId}/${userId}`,
      {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );

    if (!projectApi.ok) {
      throw new Error("Failed to assign team leader to the project!");
    }

    return await projectApi.json();
  });
}
