"use client";

import { useState, useTransition } from "react";
import { createActivity } from "@/actions/activities";

interface Team {
    id: string;
    name: string;
    color: string;
}

interface ActivityFormProps {
    campId: string;
    teams: Team[];
}

export default function ActivityForm({
    campId,
    teams,
}: ActivityFormProps) {
    const [name, setName] = useState("");
    const [scores, setScores] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function updateScore(teamId: string, value: string) {
        setScores((current) => ({
            ...current,
            [teamId]: value,
        }));
    }

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                await createActivity({
                    campId,
                    name,
                    scores: teams.map((team) => ({
                        teamId: team.id,
                        points: Number(scores[team.id] ?? ""),
                    })),
                });

                setName("");
                setScores({});
            } catch (cause) {
                const message =
                    cause instanceof Error
                        ? cause.message
                        : "No se pudo crear la actividad.";

                setError(message);
            }
        });
    }

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <label className="mb-2 block font-medium">
                    Nombre de la actividad
                </label>

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Carrera de costales"
                    className="w-full rounded-lg border px-4 py-3"
                    required
                />
            </div>

            <div className="space-y-4">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className="h-5 w-5 rounded-full border"
                                style={{
                                    backgroundColor: team.color,
                                }}
                            />

                            <span className="font-medium">
                                {team.name}
                            </span>
                        </div>

                        <input
                            inputMode="numeric"
                            pattern="-?[0-9]*"
                            placeholder="0"
                            value={scores[team.id] ?? ""}
                            onChange={(e) =>
                                updateScore(team.id, e.target.value)
                            }
                            className="w-28 rounded-lg border px-3 py-2 text-right"
                        />
                    </div>
                ))}
            </div>

            {error && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {isPending ? "Guardando..." : "Guardar actividad"}
            </button>
        </form>
    );
}