import Link from "next/link";
import { deleteCamp, getCamps } from "@/actions/camps";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function HomePage() {
    const camps = await getCamps();

    return (
        <DashboardLayout
            title="Campamentos"
            subtitle="Administra campamentos, equipos, actividades y ranking en un solo lugar."
            actions={
                <Link
                    href="/dashboard/camp/new"
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                    Nuevo campamento
                </Link>
            }
        >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100/80 text-slate-600">
                        <tr>
                            <th className="px-4 py-3 text-left">Nombre</th>
                            <th className="px-4 py-3 text-center">Equipos</th>
                            <th className="px-4 py-3 text-center">Actividades</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {camps.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-slate-500">
                                    No hay campamentos registrados.
                                </td>
                            </tr>
                        )}

                        {camps.map((camp) => (
                            <tr key={camp.id} className="border-t border-slate-200">
                                <td className="px-4 py-4">
                                    <p className="font-medium text-slate-900">{camp.name}</p>
                                    <p className="text-xs text-slate-500">/{camp.slug}</p>
                                </td>

                                <td className="px-4 py-4 text-center">{camp._count.teams}</td>
                                <td className="px-4 py-4 text-center">{camp._count.activities}</td>

                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/dashboard/camp/${camp.id}`}
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
                                        >
                                            Entrar
                                        </Link>

                                        <Link
                                            href={`/dashboard/camp/${camp.id}/edit`}
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
                                        >
                                            Editar
                                        </Link>

                                        <form action={deleteCamp.bind(null, camp.id)}>
                                            <button
                                                type="submit"
                                                className="rounded-lg border border-rose-300 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                                            >
                                                Eliminar
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
