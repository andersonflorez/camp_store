import CampForm from "@/components/CampForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function NewCampPage() {
    return (
        <DashboardLayout title="Nuevo campamento" subtitle="Crea un campamento independiente con nombre y slug.">
            <CampForm />
        </DashboardLayout>
    );
}
