export interface CampSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;

  createdAt: Date;

  teamsCount: number;

  activitiesCount: number;

  leaderPoints: number;
}

export interface TeamRanking {
  id: string;

  name: string;

  color: string;

  displayOrder: number;

  active: boolean;

  totalPoints: number;

  percentage: number;

  position: number;
}

export interface ActivityResult {
  teamId: string;

  teamName: string;

  color: string;

  points: number;
}

export interface ActivityHistory {
  id: string;

  name: string;

  description: string | null;

  notes: string | null;

  createdAt: Date;

  totalPoints: number;

  scores: ActivityResult[];
}