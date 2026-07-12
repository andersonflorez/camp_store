import { prisma } from "camp_score/src/lib/prisma";

export interface RankingItem {
  id: string;
  name: string;
  color: string;
  totalPoints: number;
  position: number;
  percentage: number;
}

export async function getRanking(campId: string): Promise<RankingItem[]> {
  const teams = await prisma.team.findMany({
    where: {
      campId,
      active: true,
    },
    include: {
      scores: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  const ranking = teams.map((team) => ({
    id: team.id,
    name: team.name,
    color: team.color,
    totalPoints: team.scores.reduce(
      (total, score) => total + score.points,
      0
    ),
  }));

  ranking.sort((a, b) => b.totalPoints - a.totalPoints);

  const leaderPoints = ranking.length > 0
    ? Math.max(ranking[0].totalPoints, 0)
    : 0;

  return ranking.map((team, index) => ({
    ...team,
    position: index + 1,
    percentage:
      leaderPoints === 0
        ? 0
        : Math.round((team.totalPoints / leaderPoints) * 100),
  }));
}