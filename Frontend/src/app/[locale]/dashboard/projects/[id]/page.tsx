export default async function page({ params }: { params: { id: string } }) {
  const param = await params;
  return <div>{param.id}</div>;
}
