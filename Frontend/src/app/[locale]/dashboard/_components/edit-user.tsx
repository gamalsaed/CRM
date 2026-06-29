import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoForm from "./edit-basic-info";
import ChangePasswordForm from "./change-password-form";
import ChangeUserPermissions from "./change-user-permissions";
import { getUserDetailsAction } from "@/shared/lib/actions/user.action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTranslations } from "next-intl/server";

/**
 * Tabbed edit view for a user's basic info, password, and permissions.
 * When no `id` is provided it defaults to the currently signed-in user.
 * The Permissions tab is only shown when an admin edits another user.
 */
export default async function EditUser({ id }: { id?: string }) {
  const [userData, session, t] = await Promise.all([
    id ? getUserDetailsAction(id) : getUserDetailsAction(),
    getServerSession(authOptions),
    getTranslations("EditUser"),
  ]);
  const user = userData.data.user;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-3xl font-semibold ">{t("title")}</h1>
        <p>{t("subtitle")}</p>
      </div>
      <Tabs
        defaultValue="account"
        className="w-full border border-gray-200 rounded-xl p-5"
      >
        <TabsList className="w-full bg-transparent ">
          <TabsTrigger value="account" className="max-sm:text-[11px]">
            {t("basicInfo")}
          </TabsTrigger>
          {}
          <TabsTrigger value="password" className="max-sm:text-[11px]">
            {t("changePassword")}
          </TabsTrigger>

          {id &&
            session?.user.role === "admin" &&
            user.email !== "gamalsaed557@gmail.com" && (
              <TabsTrigger value="permissions" className="max-sm:text-[11px]">
                {t("permissions")}
              </TabsTrigger>
            )}
        </TabsList>
        <TabsContent value="account">
          <BasicInfoForm user={user} />
        </TabsContent>

        <TabsContent value="password">
          <ChangePasswordForm userId={user._id} />
        </TabsContent>

        {id &&
          session?.user.role === "admin" &&
          user.email !== "gamalsaed557@gmail.com" && (
            <TabsContent value="permissions">
              <ChangeUserPermissions userId={user._id} currentRole={user.role} />
            </TabsContent>
          )}
      </Tabs>
    </div>
  );
}
