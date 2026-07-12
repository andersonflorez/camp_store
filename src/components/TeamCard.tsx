interface TeamCardProps {
  name: string;
  color: string;
  points: number;
  position?: number;
  percentage?: number;
}

export default function TeamCard({
  name,
  color,
  points,
  position,
  percentage,
}: TeamCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="h-5 w-5 rounded-full border"
            style={{ backgroundColor: color }}
          />

          <h3 className="text-lg font-semibold">{name}</h3>
        </div>

        {position && (
          <span className="text-2xl font-bold text-slate-400">
            #{position}
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-4xl font-bold">
          {points}
        </p>

        <p className="text-sm text-slate-500">
          puntos
        </p>
      </div>

      {percentage !== undefined && (
        <div className="mt-5">
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}