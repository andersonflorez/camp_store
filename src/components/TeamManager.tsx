"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTeam, deleteTeam, updateTeam } from "@/actions/teams";
import { TEAM_COLORS } from "@/lib/colors";

interface TeamItem {
    id: string;
    name: string;
    color: string;
    displayOrder: number;
    active: boolean;
}

interface TeamManagerProps {
    campId: string;
    teams: TeamItem[];
}

function TeamRow({
    team,
    onSave,
    onDelete,
    pending,
}: {
    team: TeamItem;
    onSave: (teamId: string, values: Omit<TeamItem, "id">) => Promise<void>;
    onDelete: (teamId: string) => Promise<void>;
    pending: boolean;
}) {
    const [name, setName] = useState(team.name);
    const [color, setColor] = useState(team.color);
    const [displayOrder, setDisplayOrder] = useState(String(team.displayOrder));
    const [active, setActive] = useState(team.active);

    return (
        <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_120px_120px_auto] md:items-center">
            <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
            />

            <select
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
            >
                {TEAM_COLORS.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.name}
                    </option>
                ))}
            </select>

            <input
                type="number"
                value={displayOrder}
                onChange={(event) => setDisplayOrder(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
            />

            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
                Activo
            </label>

            <div className="flex items-center gap-2">
                <button
                    onClick={() =>
                        onSave(team.id, {
                            name,
                            color,
                            displayOrder: Number(displayOrder),
                            active,
                        })
                    }
                    disabled={pending}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 disabled:opacity-50"
                >
                    Guardar
                </button>

                <button
                    onClick={() => onDelete(team.id)}
                    disabled={pending}
                    className="rounded-lg border border-rose-300 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}

export default function TeamManager({ campId, teams }: TeamManagerProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState(TEAM_COLORS[0]?.value ?? "#EF4444");
    const [newDisplayOrder, setNewDisplayOrder] = useState(String(teams.length + 1));
    const [newActive, setNewActive] = useState(true);

    const sortedTeams = useMemo(
        () => [...teams].sort((a, b) => a.displayOrder - b.displayOrder),
        [teams]
    );

    function runTask(task: () => Promise<void>) {
        setError(null);

        startTransition(async () => {
            try {
                await task();
                router.refresh();
            } catch (cause) {
                const message =
                    cause instanceof Error ? cause.message : "No se pudo guardar el equipo.";

                setError(message);
            }
        });
    }

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Nuevo equipo</h3>

                <div className="grid gap-3 md:grid-cols-[1fr_180px_120px_120px_auto] md:items-center">
                    <input
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                        placeholder="Nombre del equipo"
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />

                    <select
                        value={newColor}
                        onChange={(event) => setNewColor(event.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    >
                        {TEAM_COLORS.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={newDisplayOrder}
                        onChange={(event) => setNewDisplayOrder(event.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />

                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={newActive}
                            onChange={(event) => setNewActive(event.target.checked)}
                        />
                        Activo
                    </label>

                    <button
                        disabled={isPending}
                        onClick={() =>
                            runTask(async () => {
                                await createTeam({
                                    campId,
                                    name: newName,
                                    color: newColor,
                                    displayOrder: Number(newDisplayOrder),
                                    active: newActive,
                                });

                                setNewName("");
                                setNewDisplayOrder(String(teams.length + 1));
                            })
                        }
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                        Crear
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {sortedTeams.map((team) => (
                    <TeamRow
                        key={team.id}
                        team={team}
                        pending={isPending}
                        onSave={async (teamId, values) => {
                            await updateTeam(teamId, values);
                        }}
                        onDelete={async (teamId) => {
                            await deleteTeam(teamId);
                        }}
                    />
                ))}

                {teams.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                        No hay equipos en este campamento.
                    </div>
                )}
            </div>

            {error && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                </p>
            )}
        </div>
    );
}
