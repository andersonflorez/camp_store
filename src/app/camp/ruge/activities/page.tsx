interface ActivitiesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ActivitiesPage({
  params,
}: ActivitiesPageProps) {
  const { id } = await params;

  return (
    <main className="container">

      <h1>
        Actividades
      </h1>

      <p>

        Campamento:

        {id}

      </p>

    </main>
  );
}