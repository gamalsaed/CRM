"use server";

import { catchAsync } from "../utils/catchAsync";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import getMyToken from "../utils/getToken";

/**
 * Fetches projects for the current user. Admins receive all projects;
 * other roles receive only their own assigned projects.
 */
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

/** Fetches a single project by ID including its leads, team and leader. */
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

/**
 * Assigns a team leader to a project.
 * @param projectId - The project to update.
 * @param userId - The user to assign as team leader.
 */
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
