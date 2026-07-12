"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCamp, updateCamp } from "@/actions/camps";

interface CampFormProps {
    initial?: {
        id: string;
        name: string;
        slug: string;
    };
}

export default function CampForm({ initial }: CampFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initial?.name ?? "");
    const [slug, setSlug] = useState(initial?.slug ?? "");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                if (initial) {
                    await updateCamp(initial.id, { name, slug });
                    router.push(`/dashboard/camp/${initial.id}`);
                } else {
                    await createCamp({ name, slug });
                    router.push("/dashboard");
                }

                router.refresh();
            } catch (cause) {
                const message =
                    cause instanceof Error
                        ? cause.message
                        : "No se pudo guardar el campamento.";

                setError(message);
            }
        });
    }

    return (
        <form
            onSubmit={onSubmit}
            className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nombre</label>
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Campamento Jóvenes"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Slug</label>
                <input
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    placeholder="campamento-jovenes"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                />
            </div>

            {error && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
                {isPending ? "Guardando..." : initial ? "Actualizar campamento" : "Crear campamento"}
            </button>
        </form>
    );
}
