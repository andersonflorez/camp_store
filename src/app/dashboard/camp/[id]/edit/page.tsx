import { notFound } from "next/navigation";
import { getCamp } from "@/actions/camps";
import CampForm from "@/components/CampForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface CampEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CampEditPage({ params }: CampEditPageProps) {
    const { id } = await params;
    const camp = await getCamp(id);

    if (!camp) {
        notFound();
    }

    return (
        <DashboardLayout
            title={`Editar ${camp.name}`}
            subtitle="Actualiza nombre o slug del campamento."
            campId={camp.id}
            campSlug={camp.slug}
        >
            <CampForm
                initial={{
                    id: camp.id,
                    name: camp.name,
                    slug: camp.slug,
                }}
            />
        </DashboardLayout>
    );
}
