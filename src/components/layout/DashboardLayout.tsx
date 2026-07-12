import { ReactNode } from "react";
import Link from "next/link";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  campId?: string;
  campSlug?: string;
  actions?: ReactNode;
}

export default function DashboardLayout({
  title,
  subtitle,
  children,
  campId,
  campSlug,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight">Camp Score</h1>
        </div>

        <nav className="flex flex-col gap-1 p-4 text-sm text-slate-700">

          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 hover:bg-slate-100"
          >
            Campamentos
          </Link>

          {campId && (
            <>
              <Link
                href={`/dashboard/camp/${campId}`}
                className="rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                Inicio
              </Link>

              <Link
                href={`/dashboard/camp/${campId}/teams`}
                className="rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                Equipos
              </Link>

              <Link
                href={`/dashboard/camp/${campId}/activities`}
                className="rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                Actividades
              </Link>

              <Link
                href={`/dashboard/camp/${campId}/ranking`}
                className="rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                Ranking
              </Link>

              {campSlug && (
                <Link
                  href={`/public/${campSlug}`}
                  target="_blank"
                  className="rounded-lg px-3 py-2 hover:bg-slate-100"
                >
                  Pantalla pública
                </Link>
              )}
            </>
          )}
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {actions}
        </header>

        {children}
      </main>
    </div>
  );
}