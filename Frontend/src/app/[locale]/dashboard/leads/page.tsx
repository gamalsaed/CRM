import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import LeadsTable from "../_components/leads-table";
import { getLeads } from "@/shared/lib/services/leads.s";
import getMyToken from "@/shared/lib/utils/getToken";
import UploadDialog from "./_components/upload-dialog";
import DownloadLeads from "./_components/download-leads";
import { getTranslations } from "next-intl/server";

export default async function page() {
  const t = await getTranslations("LeadsPage");
  const token = await getMyToken();
  const { data: leadsData } = await getLeads(`${token}`);
  return (
    <div>
      <header className="flex items-center justify-between max-md:flex-col max-md:gap-4 mb-4">
        <div>
          <h1 className=" text-3xl font-semibold max-md:text-center">
            {t("title")}
          </h1>
          <p className="text-gray-500">{t("subtitle")}</p>
        </div>
        <div className="flex max-sm:flex-col gap-3">
          <Link href="/dashboard/leads/create-leads">
            <Button className="w-32">
              <Plus /> {t("createLeads")}
            </Button>
          </Link>
          <UploadDialog />
          <DownloadLeads leads={leadsData.data.leads} />
        </div>
      </header>
      <LeadsTable env="project" leads={leadsData.data.leads} />
    </div>
  );
}
