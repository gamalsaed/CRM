export default async function Home() {
  const api = await fetch(`${process.env.API}/leads`, {
    headers: {
      authorization: `${process.env.TOKEN}`,
    },
  });
  const leads = await api.json();
  console.log(leads.data);
  return <div>asdas</div>;
}
