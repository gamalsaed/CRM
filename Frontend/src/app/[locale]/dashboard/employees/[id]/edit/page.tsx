import EditUser from "../../../_components/edit-user";

/** Employee edit page. Passes the route param ID to the shared EditUser component. */
export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return <EditUser id={id} />;
}
