"use client";

import { LockKeyhole, Check } from "lucide-react";
import { ROLE_PERMISSIONS } from "@/shared/lib/constant";
import { useTranslations } from "next-intl";

export default function Permissions({
  role,
}: {
  role: "admin" | "team leader" | "data entry" | "user";
}) {
  const t = useTranslations("EmployeePermissions");

  return (
    <div className="border border-gray-200 rounded-xl p-5 mt-4 h-fit flex-1 max-lg:col-span-3">
      <div className="flex items-center  gap-4">
        <div className="bg-primary-50 w-fit p-2 rounded-full">
          <LockKeyhole className="text-primary-400" size={20} />
        </div>
        <span className="font-semibold">{t("title")}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {ROLE_PERMISSIONS[role].map((rol) => (
          <div
            key={rol}
            className="px-3 py-2 bg-primary-50 text-sm  flex gap-2 rounded-2xl text-primary-400"
          >
            <Check size={20} />
            <span>{rol}</span>
          </div>
        ))}
      </div>
      <div className="w-2/3 mt-5 text-gray-500 font-semibold">
        {t("description")}
      </div>
    </div>
  );
}
