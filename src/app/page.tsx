import Link from "next/link";
import { getCamps } from "@/actions/camps";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function HomePage() {
  const camps = await getCamps();

  return (
    <DashboardLayout title="Campamentos">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-slate-500">
          Administra todas las competencias.
        </p>

        <Link
          href="/camp/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Nuevo campamento
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-100">
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
                <td
                  colSpan={4}
                  className="p-10 text-center text-slate-500"
                >
                  No hay campamentos registrados.
                </td>
              </tr>
            )}

            {camps.map((camp) => (
              <tr
                key={camp.id}
                className="border-t"
              >
                <td className="px-4 py-4">
                  <div className="font-semibold">
                    {camp.name}
                  </div>

                  <div className="text-sm text-slate-500">
                    {camp.slug}
                  </div>
                </td>

                <td className="text-center">
                  {camp.teams.length}
                </td>

                <td className="text-center">
                  {camp.activities.length}
                </td>

                <td className="px-4 py-4 text-right">
                  <Link
                    href={`/camp/${camp.id}`}
                    className="rounded-lg border px-4 py-2 hover:bg-slate-100"
                  >
                    Entrar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}