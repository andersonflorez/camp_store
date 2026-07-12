import { notFound } from "next/navigation";
import { getActivities } from "@/actions/activities";
import { getCamp } from "@/actions/camps";
import { getTeams } from "@/actions/teams";
import ActivityForm from "@/components/ActivityForm";
import ActivityList from "@/components/ActivityList";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface ActivitiesPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ActivitiesPage({ params }: ActivitiesPageProps) {
    const { id } = await params;

    const [camp, teams, activities] = await Promise.all([
        getCamp(id),
        getTeams(id),
        getActivities(id),
    ]);

    if (!camp) {
        notFound();
    }

    const activeTeams = teams.filter((team) => team.active);

    return (
        <DashboardLayout
            title={`Actividades · ${camp.name}`}
            subtitle="Las actividades son inmutables: para corregir, crea una nueva actividad con puntos negativos."
            campId={camp.id}
            campSlug={camp.slug}
        >
            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <ActivityForm
                    campId={camp.id}
                    teams={activeTeams.map((team) => ({
                        id: team.id,
                        name: team.name,
                        color: team.color,
                    }))}
                />
                <ActivityList campId={camp.id} activities={activities} />
            </div>
        </DashboardLayout>
    );
}
