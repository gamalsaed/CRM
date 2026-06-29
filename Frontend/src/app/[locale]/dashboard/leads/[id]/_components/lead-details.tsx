"use client";

import { useState } from "react";
import { LeadType } from "@/shared/lib/types/app-data.t";
import { Phone, Mail, Building2, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { formatDate } from "@/shared/lib/utils/formateDate";
import { SourceIcon } from "@/shared/lib/utils/source-icons";
import { LeadStatusSelect } from "./select-status";
import EditLeadFormDialog from "./edit-lead-form-dialog";
import { useTranslations } from "next-intl";

type LeadDetailsProps = {
  name: string;
  phone: string;
  whatsApp: string;
  projectName: string;
  createdAt: Date | string;
  createdBy: string;
  email: string;
  source: LeadType["source"];
  assignedTo: string;
  status: LeadType["status"];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function LeadDetails({
  name,
  phone,
  whatsApp,
  projectName,
  createdAt,
  createdBy,
  email,
  source,
  assignedTo,
  status,
}: LeadDetailsProps) {
  const t = useTranslations("LeadDetails");
  const formattedDate = formatDate(createdAt);
  const [selectStatus, setSelectStatus] = useState<LeadType["status"]>(status);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 ">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-base font-semibold text-blue-600">
          {getInitials(name)}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
            <LeadStatusSelect value={selectStatus} onChange={setSelectStatus} />
          </div>
          <p className="text-sm text-gray-400">
            {t("addedOn")} {formattedDate}&nbsp;&bull;&nbsp;{t("by")}&nbsp;
            <span className="font-medium text-blue-500">{createdBy}</span>
          </p>
        </div>
        <div className="w-full flex justify-end">
          <EditLeadFormDialog
            defaultValues={{ name, phone, email, whatsApp }}
          />
        </div>
      </div>

      <div className="mt-5 flex w-full  gap-10 flex-wrap max-md:flex-col max-md:justify-center font-semibold border-t pt-4">
        <div className="flex flex-1 justify-between gap-10 max-md:flex-col">
          <div className="flex items-center gap-2  text-gray-700">
            <Phone className="h-5 w-6 text-gray-400" />
            <span>{phone.startsWith("+") ? phone : `+${phone}`}</span>
          </div>

          <div className="flex items-center gap-2  text-gray-700">
            <FaWhatsapp className="h-5 w-6 " color="#25D366" />
            {whatsApp ? (
              <span>
                {whatsApp.startsWith("+") ? whatsApp : `+${whatsApp}`}
              </span>
            ) : (
              "-"
            )}
          </div>
          <div className="flex items-center gap-2   text-gray-700">
            <Mail className="h-5 w-6 text-gray-400" />
            <span>{email}</span>
          </div>
        </div>

        <div className="flex gap-10 flex-1 max-md:flex-col w-1/2 max-md:w-full justify-between">
          <div className="flex flex-col  gap-4">
            <span className=" text-gray-400">{t("project")}</span>
            <div className="flex items-center gap-2  font-medium text-gray-700">
              <Building2 className="h-7 w-7 text-gray-400" />
              <span>{projectName}</span>
            </div>
          </div>
          <div className="flex gap-3 flex-col ">
            <span className=" text-gray-400">{t("source")}</span>
            <div className="flex items-center gap-2  font-medium text-gray-700">
              <SourceIcon source={source} />
              <span className="capitalize">{source}</span>
            </div>
          </div>
          <div className="flex gap-3 flex-col ">
            <span className=" text-gray-400">{t("assignedTo")}</span>
            <div className="flex items-center gap-2  font-medium text-gray-700">
              <User />
              <span className="capitalize">
                {assignedTo ? assignedTo : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
