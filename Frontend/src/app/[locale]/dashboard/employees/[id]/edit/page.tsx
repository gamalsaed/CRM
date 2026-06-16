import EditUser from "../../../_components/edit-user";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return <EditUser id={id} />;
}
