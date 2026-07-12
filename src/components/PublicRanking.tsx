"use client";

import { useEffect, useState } from "react";
import type { RankingItem } from "@/lib/ranking";

interface PublicRankingProps {
    slug: string;
    initialCampName: string;
    initialRanking: RankingItem[];
}

interface RankingResponse {
    campName: string;
    campSlug: string;
    ranking: RankingItem[];
}

export default function PublicRanking({
    slug,
    initialCampName,
    initialRanking,
}: PublicRankingProps) {
    const [campName, setCampName] = useState(initialCampName);
    const [ranking, setRanking] = useState(initialRanking);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const hasUniqueLeader =
        ranking.length > 0 &&
        (ranking.length === 1 || ranking[0].points > ranking[1].points);

    useEffect(() => {
        let cancelled = false;

        async function loadRanking() {
            const response = await fetch(`/api/camps/${slug}/ranking`, {
                cache: "no-store",
            });

            if (!response.ok || cancelled) {
                return;
            }

            const payload = (await response.json()) as RankingResponse;

            if (cancelled) {
                return;
            }

            setCampName(payload.campName);
            setRanking(payload.ranking);
            setLastUpdate(new Date());
        }

        void loadRanking();
        const intervalId = setInterval(loadRanking, 2000);

        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, [slug]);

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-center text-4xl font-semibold tracking-tight md:text-5xl">{campName}</h1>
                <p className="mt-3 text-center text-xs text-slate-400 md:text-sm">
                    Actualiza automaticamente cada 2 segundos · Ultima actualizacion: {lastUpdate.toLocaleTimeString("es-CO")}
                </p>

                <div className="mt-10 overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/70 shadow-2xl">
                    <table className="w-full text-lg md:text-2xl">
                        <thead className="bg-slate-800/80 text-slate-300">
                            <tr>
                                <th className="w-24 px-4 py-5 text-center">Pos.</th>
                                <th className="px-4 py-5 text-left">Equipo</th>
                                <th className="w-36 px-4 py-5 text-right">Puntos</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ranking.map((team) => {
                                const isHighlightedLeader = hasUniqueLeader && team.position === 1;

                                return (
                                    <tr
                                        key={team.id}
                                        className={
                                            isHighlightedLeader
                                                ? "leader-glow border-t border-amber-400/30 bg-amber-400/10"
                                                : "border-t border-slate-700/70"
                                        }
                                    >
                                        <td className="px-4 py-5 text-center font-semibold">
                                            <span className="inline-flex items-center gap-2">
                                                {isHighlightedLeader && <span aria-hidden>👑</span>}
                                                {team.position}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="inline-flex items-center gap-4">
                                                <span
                                                    className={
                                                        isHighlightedLeader
                                                            ? "leader-dot h-8 w-8 rounded-full border-2 border-slate-100 shadow-[0_0_0_7px_rgba(250,204,21,0.16)] md:h-10 md:w-10"
                                                            : "h-8 w-8 rounded-full border-2 border-slate-200 shadow-[0_0_0_6px_rgba(148,163,184,0.15)] md:h-10 md:w-10"
                                                    }
                                                    style={{ backgroundColor: team.color }}
                                                />
                                                <span className={isHighlightedLeader ? "font-bold text-amber-200" : "font-semibold"}>
                                                    {team.name}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-5 text-right font-semibold">
                                            <span className={isHighlightedLeader ? "inline-flex items-center gap-2 text-amber-200" : "inline-flex items-center gap-2"}>
                                                {isHighlightedLeader && <span aria-hidden>🏆</span>}
                                                {team.points}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
