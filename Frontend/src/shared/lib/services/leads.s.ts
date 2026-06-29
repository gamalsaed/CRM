import { catchAsync } from "../utils/catchAsync";

/**
 * Fetches aggregated lead counts grouped by status.
 * Used to populate the status tracker cards and bar chart on the home page.
 */
export async function getLeadsStatus(token: string) {
  return catchAsync(async () => {
    const statusApi = await fetch(
      `${process.env.BASE_API}/leads/status-stats`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );

    if (!statusApi.ok) {
      throw new Error("Failed to load leads");
    }
    const data = await statusApi.json();
    return data.data;
  });
}

/** Fetches all leads accessible to the current user. */
export async function getLeads(token: string) {
  return catchAsync(async () => {
    const statusApi = await fetch(`${process.env.BASE_API}/leads`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await statusApi.json();
    if (data.status === "fail") {
      throw new Error(data?.message || "Something went wrong try again later");
    }
    if (!statusApi.ok) {
      throw new Error("Failed to load leads");
    }
    return data;
  });
}
