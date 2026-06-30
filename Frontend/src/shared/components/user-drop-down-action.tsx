"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2 } from "lucide-react";
import DeleteDialog from "./delete-dialog";
import { removeUserFromProjectAction } from "../lib/actions/projects.action";
import { useTranslations } from "next-intl";

export default function UserDropDownActions({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) {
  const t = useTranslations("UserDropDown");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-6 w-6">
        <button className="flex size-6 items-center justify-center">
          <EllipsisVertical size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" w-48 py-1 rounded-xl">
        <DropdownMenuGroup>
          <div>
            <DeleteDialog
              args={[projectId, userId]}
              deleteFn={removeUserFromProjectAction}
              successMsg={t("removeSuccessMsg")}
              failMsg={t("removeFailMsg")}
              title={t("removeTitle")}
              description={t("removeDescription")}
            >
              <div className="cursor-pointer p-2 text-[12px] text-red-600  hover:bg-red-50 flex items-center gap-3">
                <Trash2 width={16} height={16} />
                <p>{t("remove")}</p>
              </div>
            </DeleteDialog>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
