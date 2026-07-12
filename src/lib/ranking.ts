import { prisma } from "./prisma";

export interface RankingItem {
  id: string;
  name: string;
  color: string;
  points: number;
  position: number;
  diffFromLeader: number;
}

async function buildRanking(campId: string): Promise<RankingItem[]> {
  const [teams, groupedScores] = await Promise.all([
    prisma.team.findMany({
      where: {
        campId,
        active: true,
      },
      select: {
        id: true,
        name: true,
        color: true,
        displayOrder: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    }),
    prisma.activityScore.groupBy({
      by: ["teamId"],
      where: {
        team: {
          campId,
          active: true,
        },
      },
      _sum: {
        points: true,
      },
    }),
  ]);

  const pointsByTeamId = new Map(
    groupedScores.map((item) => [item.teamId, item._sum.points ?? 0])
  );

  const sorted = teams
    .map((team) => ({
      id: team.id,
      name: team.name,
      color: team.color,
      points: pointsByTeamId.get(team.id) ?? 0,
      displayOrder: team.displayOrder,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      return a.displayOrder - b.displayOrder;
    });

  const leaderPoints = sorted[0]?.points ?? 0;

  return sorted.map((item, index) => ({
    id: item.id,
    name: item.name,
    color: item.color,
    points: item.points,
    position: index + 1,
    diffFromLeader: item.points - leaderPoints,
  }));
}

export async function getRanking(campId: string): Promise<RankingItem[]> {
  return buildRanking(campId);
}

export async function getRankingBySlug(slug: string): Promise<{
  campName: string;
  campSlug: string;
  ranking: RankingItem[];
} | null> {
  const camp = await prisma.camp.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!camp) {
    return null;
  }

  const ranking = await buildRanking(camp.id);

  return {
    campName: camp.name,
    campSlug: camp.slug,
    ranking,
  };
}