interface RankingTeam {
  id: string;
  name: string;
  color: string;
  totalPoints: number;
  percentage: number;
  position: number;
}

interface RankingTableProps {
  teams: RankingTeam[];
}

export default function RankingTable({
  teams,
}: RankingTableProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-4 py-3 text-center w-20">
              #
            </th>

            <th className="px-4 py-3 text-left">
              Equipo
            </th>

            <th className="px-4 py-3">
              Progreso
            </th>

            <th className="px-4 py-3 text-right">
              Puntos
            </th>

          </tr>

        </thead>

        <tbody>

          {teams.map((team) => (

            <tr
              key={team.id}
              className="border-t"
            >

              <td className="text-center font-bold">
                {team.position}
              </td>

              <td>

                <div className="flex items-center gap-3 px-4 py-4">

                  <span
                    className="h-5 w-5 rounded-full border"
                    style={{
                      backgroundColor: team.color,
                    }}
                  />

                  <span className="font-semibold">
                    {team.name}
                  </span>

                </div>

              </td>

              <td className="px-4">

                <div className="h-3 rounded-full bg-slate-200">

                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${team.percentage}%`,
                      backgroundColor: team.color,
                    }}
                  />

                </div>

              </td>

              <td className="px-4 text-right font-bold text-lg">
                {team.totalPoints}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}