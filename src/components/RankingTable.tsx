interface RankingTeam {
  id: string;
  name: string;
  color: string;
  points: number;
  diffFromLeader: number;
  position: number;
}

interface RankingTableProps {
  teams: RankingTeam[];
}

export default function RankingTable({
  teams,
}: RankingTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-100/80 text-slate-600">
          <tr>
            <th className="w-20 px-4 py-3 text-center">Pos.</th>
            <th className="px-4 py-3 text-left">Equipo</th>
            <th className="w-28 px-4 py-3 text-right">Puntos</th>
            <th className="w-44 px-4 py-3 text-right">Dif. líder</th>
          </tr>
        </thead>

        <tbody>
          {teams.map((team) => (
            <tr key={team.id} className="border-t border-slate-200">
              <td className="px-4 py-4 text-center font-semibold">{team.position}</td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-full border border-slate-300"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="font-medium text-slate-900">{team.name}</span>
                </div>
              </td>

              <td className="px-4 py-4 text-right font-semibold">{team.points}</td>
              <td className="px-4 py-4 text-right text-slate-600">
                {team.diffFromLeader === 0 ? "Líder" : team.diffFromLeader}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}