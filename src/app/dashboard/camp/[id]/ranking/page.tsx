import { notFound } from "next/navigation";
import { getCamp } from "@/actions/camps";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RankingTable from "@/components/RankingTable";
import { getRanking } from "@/lib/ranking";

interface RankingPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function RankingPage({ params }: RankingPageProps) {
    const { id } = await params;
    const [camp, ranking] = await Promise.all([getCamp(id), getRanking(id)]);

    if (!camp) {
        notFound();
    }

    return (
        <DashboardLayout
            title={`Ranking · ${camp.name}`}
            subtitle="Ordenado por mayor puntaje y diferencia con el líder."
            campId={camp.id}
            campSlug={camp.slug}
        >
            <RankingTable teams={ranking} />
        </DashboardLayout>
    );
}
