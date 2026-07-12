import { ReactNode } from "react";
import Link from "next/link";

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
  campId?: string;
}

export default function DashboardLayout({
  title,
  children,
  campId,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold">
            Camp Score
          </h1>
        </div>

        <nav className="flex flex-col p-4 gap-2">

          <Link
            href="/"
            className="rounded-lg px-4 py-3 hover:bg-slate-100"
          >
            🏕️ Campamentos
          </Link>

          {campId && (
            <>
              <Link
                href={`/camp/${campId}`}
                className="rounded-lg px-4 py-3 hover:bg-slate-100"
              >
                Inicio
              </Link>

              <Link
                href={`/camp/${campId}/teams`}
                className="rounded-lg px-4 py-3 hover:bg-slate-100"
              >
                👥 Equipos
              </Link>

              <Link
                href={`/camp/${campId}/activities`}
                className="rounded-lg px-4 py-3 hover:bg-slate-100"
              >
                🎯 Actividades
              </Link>

              <Link
                href={`/camp/${campId}/ranking`}
                className="rounded-lg px-4 py-3 hover:bg-slate-100"
              >
                🏆 Ranking
              </Link>

              <Link
                href={`/public/${campId}`}
                target="_blank"
                className="rounded-lg px-4 py-3 hover:bg-slate-100"
              >
                📺 Pantalla pública
              </Link>
            </>
          )}
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">
            {title}
          </h2>
        </header>

        {children}
      </main>
    </div>
  );
}