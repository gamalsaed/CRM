import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoForm from "./edit-basic-info";
import ChangePasswordForm from "./change-password-form";
import ChangeUserPermissions from "./change-user-permissions";
import { getUserDetailsAction } from "@/shared/lib/actions/user.action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function EditUser({ id }: { id?: string }) {
  const userData = id
    ? await getUserDetailsAction(id)
    : await getUserDetailsAction();
  const user = userData.data.user;
  const session = await getServerSession(authOptions);

  console.log(session?.user);
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-3xl font-semibold ">Edit User</h1>
        <p>Update user information and manage account settings</p>
      </div>
      <Tabs
        defaultValue="account"
        className="w-full border border-gray-200 rounded-xl p-5"
      >
        <TabsList className="w-full bg-transparent ">
          <TabsTrigger value="account" className="max-sm:text-[11px]">
            Basic Information
          </TabsTrigger>
          {}
          <TabsTrigger value="password" className="max-sm:text-[11px]">
            Change Password
          </TabsTrigger>

          {id &&
            session?.user.role === "admin" &&
            user.email !== "gamalsaed557@gmail.com" && (
              <TabsTrigger value="permissions" className="max-sm:text-[11px]">
                Permissions
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
