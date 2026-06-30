import { Button } from "@/components/ui/button";
import UserTable from "@/app/[locale]/dashboard/_components/user-table";
import { getUsersAction } from "@/shared/lib/actions/user.action";
import UserForm from "./_components/user-form";

/** Employees list page. Fetches all users and renders a clickable table with a create-user dialog. */
export default async function page() {
  const result = await getUsersAction();
  return (
    <div>
      <UserForm />
      <UserTable env="page" users={result.data.query} clickable={true} />
    </div>
  );
}
