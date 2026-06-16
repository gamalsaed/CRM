import { Button } from "@/components/ui/button";
import UserTable from "@/app/[locale]/dashboard/_components/user-table";
import { getUsersAction } from "@/shared/lib/actions/user.action";
import UserForm from "./_components/user-form";
export default async function page() {
  const result = await getUsersAction();
  return (
    <div>
      <UserForm>
        <Button className="w-fit">+ New Employee</Button>
      </UserForm>
      <UserTable users={result.data.query} clickable={true} />
    </div>
  );
}
