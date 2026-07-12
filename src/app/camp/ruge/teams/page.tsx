interface TeamsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeamsPage({
  params,
}: TeamsPageProps) {
  const { id } = await params;

  return (
    <main className="container">

      <h1>
        Equipos
      </h1>

      <p>

        Campamento:

        {id}

      </p>

    </main>
  );
}