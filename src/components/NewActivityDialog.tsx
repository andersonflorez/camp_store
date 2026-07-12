"use client";

import { useState, useTransition } from "react";
import { createActivity } from "@/actions/activities";

interface Team {
  id: string;
  name: string;
  color: string;
}

interface Props {
  campId: string;
  teams: Team[];
}

export default function NewActivityDialog({
  campId,
  teams,
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [scores, setScores] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function updateScore(teamId: string, value: string) {
    setScores((current) => ({
      ...current,
      [teamId]: value,
    }));
  }

  function submit() {
    startTransition(async () => {
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
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-5 py-3 text-white"
      >
        Nueva actividad
      </button>

      {!open && null}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">

            <h2 className="mb-6 text-2xl font-bold">
              Nueva actividad
            </h2>

            <input
              className="mb-6 w-full rounded-lg border p-3"
              placeholder="Nombre de la actividad"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="space-y-3">

              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">

                    <span
                      className="h-4 w-4 rounded-full border"
                      style={{
                        backgroundColor: team.color,
                      }}
                    />

                    {team.name}

                  </div>

                  <input
                    inputMode="numeric"
                    placeholder="0"
                    value={scores[team.id] ?? ""}
                    onChange={(e) =>
                      updateScore(team.id, e.target.value)
                    }
                    className="w-24 rounded-lg border p-2 text-right"
                  />
                </div>
              ))}

            </div>

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancelar
              </button>

              <button
                disabled={pending}
                onClick={submit}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white"
              >
                Guardar
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}