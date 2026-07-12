import Link from "next/link";
import { notFound } from "next/navigation";
import { getCamp } from "@/actions/camps";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RankingTable from "@/components/RankingTable";
import { getRanking } from "@/lib/ranking";

interface CampPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CampPage({ params }: CampPageProps) {
    const { id } = await params;
    const [camp, ranking] = await Promise.all([getCamp(id), getRanking(id)]);

    if (!camp) {
        notFound();
    }

    return (
        <DashboardLayout
            title={camp.name}
            subtitle="Resumen rápido del ranking actual."
            campId={camp.id}
            campSlug={camp.slug}
            actions={
                <div className="flex items-center gap-2">
                    <Link
                        href={`/dashboard/camp/${camp.id}/activities`}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
                    >
                        Actividades
                    </Link>
                    <Link
                        href={`/dashboard/camp/${camp.id}/teams`}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
                    >
                        Equipos
                    </Link>
                </div>
            }
        >
            <RankingTable teams={ranking} />
        </DashboardLayout>
    );
}
