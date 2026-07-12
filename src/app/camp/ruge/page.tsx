import DashboardLayout from "@/components/layout/DashboardLayout";
import RankingTable from "@/components/RankingTable";

import { getCamp } from "@/actions/camps";
import { getRanking } from "@/lib/ranking";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CampPage({
  params,
}: Props) {
  const { id } = await params;

  const camp = await getCamp(id);

  if (!camp) {
    return <div>Campamento no encontrado.</div>;
  }

  const ranking = await getRanking(id);

  return (
    <DashboardLayout
      campId={id}
      title={camp.name}
    >
      <div className="mb-6 flex justify-end">

        <a
          href={`/camp/${id}/activities/new`}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          Nueva actividad
        </a>

      </div>

      <RankingTable teams={ranking} />

    </DashboardLayout>
  );
}