import getMyToken from "@/shared/lib/utils/getToken";
import Link from "next/link";
import CountCard from "@/shared/components/leads-status-card";
import { ErrorBox } from "@/shared/components/error_box";
import { getLeadsStatus, getLeads } from "@/shared/lib/services/leads.s";
import { getProjects } from "@/shared/lib/services/projects.s";
import LeadsTable from "./_components/leads-table";
import Projects from "@/shared/layouts/projects";

export default async function page() {
  // Token
  const token = await getMyToken();

  // Fetching Data
  const { error: leadsStatusError, data: leadsStatusData } =
    await getLeadsStatus(`${token}`);
  const { error: projectsError, data: projectsData } = await getProjects(
    `${token}`,
  );
  const { error: leadsError, data: leadsData } = await getLeads(`${token}`);

  // Variables
  leadsStatusData?.stats?.push({ status: "total", count: 0 });
  let total = 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-500 mb-4">Track leads</h1>
      {leadsStatusError && <ErrorBox error={`${leadsStatusError}`} />}
      {/* LEADS TRACKER */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {leadsStatusData &&
          leadsStatusData.stats.map(
            (state: { status: string; count: number }) => {
              if (state.status !== "total") {
                total += state.count;
              } else {
                state.count = total;
              }

              return (
                <CountCard
                  key={state.status}
                  title={state.status}
                  count={state.count}
                />
              );
            },
          )}
      </div>
      <div className="flex items-center justify-between mb-4 mt-8">
        <h1 className="text-3xl font-bold text-primary-500 ">Projects</h1>
        <Link
          href="/dashboard/projects"
          className="text-sm text-gray-400 cursor-pointer"
        >
          View All Projects
        </Link>
      </div>
      {/* PROJECTS */}
      <Projects
        data={projectsData?.data.projects.slice(0, 2) ?? []}
        error={projectsError}
      />
      {/* LEADS TABLE */}
      {leadsError && <ErrorBox error={`${leadsError}`} />}
      {leadsData && leadsData.status === "success" && (
        <LeadsTable leads={leadsData.data.leads} />
      )}
    </div>
  );
}
