"use client";

import { useState, useTransition } from "react";
import { deleteActivity } from "@/actions/activities";

interface ActivityItem {
    id: string;
    name: string;
    createdAt: Date;
    scores: {
        id: string;
        points: number;
        team: {
            name: string;
            color: string;
        };
    }[];
}

interface ActivityListProps {
    campId: string;
    activities: ActivityItem[];
}

export default function ActivityList({ campId, activities }: ActivityListProps) {
    const [error, setError] = useState<string | null>(null);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function onDelete(activityId: string) {
        const confirmed = window.confirm("¿Eliminar esta actividad? Esta acción no se puede deshacer.");

        if (!confirmed) {
            return;
        }

        setError(null);
        setPendingId(activityId);

        startTransition(async () => {
            try {
                await deleteActivity(activityId, campId);
            } catch (cause) {
                const message =
                    cause instanceof Error ? cause.message : "No se pudo eliminar la actividad.";

                setError(message);
            } finally {
                setPendingId(null);
            }
        });
    }

    if (activities.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No hay actividades registradas todavía.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {activities.map((activity) => (
                <div key={activity.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="font-medium text-slate-900">{activity.name}</h3>
                            <p className="text-xs text-slate-500">
                                {new Date(activity.createdAt).toLocaleString("es-CO")}
                            </p>
                        </div>

                        <button
                            onClick={() => onDelete(activity.id)}
                            disabled={isPending}
                            className="rounded-lg border border-rose-300 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                        >
                            {pendingId === activity.id ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>

                    <div className="grid gap-2 text-sm md:grid-cols-2">
                        {activity.scores.map((score) => (
                            <div key={score.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                <span className="inline-flex items-center gap-2 text-slate-700">
                                    <span
                                        className="h-3 w-3 rounded-full border border-slate-300"
                                        style={{ backgroundColor: score.team.color }}
                                    />
                                    {score.team.name}
                                </span>
                                <span className="font-semibold text-slate-900">{score.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {error && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                </p>
            )}
        </div>
    );
}
