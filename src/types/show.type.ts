export type Show = {
  id: number;
  name: string;
  genres: string[];
  rating: string;
  image: { medium?: string; original?: string } | null;
  summaryHtml: string;
  language?: string | null;
  premiered?: string | null;
  ended?: string | null;
  status?: string | null;
  officialSite?: string | null;
  url?: string;
};

export const UNKNOWN_GENRE = 'Other';

export type TvMazeCastItem = {
  person: {
    id: number;
    name: string;
    image: { medium?: string | null; original?: string | null } | null;
  };
  character: {
    id: number;
    name: string;
    image: { medium?: string | null; original?: string | null } | null;
  };
  self: boolean;
  voice: boolean;
};

export type TvMazeImage = { medium?: string | null; original?: string | null };
export type TvMazeRating = { average?: number | null };

export type TvMazeShow = {
  id: number;
  name: string;
  genres: string[];
  rating: TvMazeRating;
  image: TvMazeImage | null;
  summary: string | null;
  language: string | null;
  premiered: string | null;
  ended: string | null;
  status: string | null;
  officialSite: string | null;
  url: string;
};

export type TvMazeSearchItem = { score: number; show: TvMazeShow };

export type CastMember = {
  personId: number;
  personName: string;
  personImage?: string;
  characterName: string;
  characterImage?: string;
};
