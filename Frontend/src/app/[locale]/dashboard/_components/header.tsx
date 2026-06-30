import { SidebarTrigger } from "@/components/ui/sidebar";
import ProfileDropDown from "./profile-drop-down";
import LanguageDropDown from "./language-drop-down";
import { getTranslations } from "next-intl/server";

export default async function Header() {
  const t = await getTranslations("Layout");
  return (
    <div className="h-14 border-b flex items-center w-full px-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <h1>{t("dashboard")}</h1>
        </div>
        <div className="flex gap-2">
          <LanguageDropDown />
          <ProfileDropDown />
        </div>
      </div>
    </div>
  );
}
