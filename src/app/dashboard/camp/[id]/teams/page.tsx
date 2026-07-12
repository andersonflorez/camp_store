import { notFound } from "next/navigation";
import { getCamp } from "@/actions/camps";
import { getTeams } from "@/actions/teams";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TeamManager from "@/components/TeamManager";

interface TeamsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TeamsPage({ params }: TeamsPageProps) {
    const { id } = await params;
    const [camp, teams] = await Promise.all([getCamp(id), getTeams(id)]);

    if (!camp) {
        notFound();
    }

    return (
        <DashboardLayout
            title={`Equipos · ${camp.name}`}
            subtitle="Gestiona nombre, color, orden y estado activo de cada equipo."
            campId={camp.id}
            campSlug={camp.slug}
        >
            <TeamManager campId={camp.id} teams={teams} />
        </DashboardLayout>
    );
}
