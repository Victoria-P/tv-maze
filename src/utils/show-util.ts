import {
  UNKNOWN_GENRE,
  type CastMember,
  type Show,
  type TvMazeCastItem,
  type TvMazeShow,
} from '@/types/show.type';

export const sortByRatingDesc = (shows: Show[]): Show[] => {
  return [...shows].sort((a, b) => {
    if (b.rating !== a.rating) return Number(b.rating) - Number(a.rating);
    const nameCmp = a.name.localeCompare(b.name);
    if (nameCmp !== 0) return nameCmp;
    return a.id - b.id;
  });
};

export const groupByGenre = (shows: Show[]): Record<string, Show[]> => {
  const map: Record<string, Show[]> = {};
  for (const show of shows) {
    const genres = show.genres?.length ? show.genres : [UNKNOWN_GENRE];
    for (const g of genres) {
      const key = g?.trim() ? g : UNKNOWN_GENRE;
      (map[key] ??= []).push(show);
    }
  }
  return map;
};

export const htmlToText = (html: string): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
};

export const truncateText = (text: string, max = 180): string => {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;

  const cut = trimmed.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(' ');
  const sliced = lastSpace > 80 ? cut.slice(0, lastSpace) : trimmed.slice(0, max); // fallback if no spaces
  return `${sliced.trimEnd()}…`;
};

export const normalizeQuery = (q: string): string => {
  return q.trim().toLowerCase();
};

export const filterByName = (shows: Show[], query: string): Show[] => {
  const q = normalizeQuery(query);
  if (!q) return shows;
  return shows.filter((s) => s.name.toLowerCase().includes(q));
};

export const getGenreOrder = (grouped: Record<string, Show[]>): string[] => {
  return Object.keys(grouped).sort((a, b) => {
    if (a === UNKNOWN_GENRE) return 1;
    if (b === UNKNOWN_GENRE) return -1;
    return a.localeCompare(b);
  });
};

export const mapTvMazeShow = (s: TvMazeShow): Show => ({
  id: s.id,
  name: s.name,
  genres: Array.isArray(s.genres) ? s.genres : [],
  rating: normalizeRating(s.rating?.average).toFixed(1),
  image: s.image
    ? { medium: s.image.medium ?? undefined, original: s.image.original ?? undefined }
    : null,
  summaryHtml: s.summary ?? '',
  language: s.language ?? null,
  premiered: s.premiered ?? null,
  ended: s.ended ?? null,
  status: s.status ?? null,
  officialSite: s.officialSite ?? null,
  url: s.url,
});

export function normalizeRating(val: unknown): number {
  const num = typeof val === 'number' ? val : 0;
  return Number.isFinite(num) ? num : 0;
}

export function mapTvMazeCast(items: TvMazeCastItem[]): CastMember[] {
  return items.map((x) => ({
    personId: x.person.id,
    personName: x.person.name,
    personImage: x.person.image?.medium ?? x.person.image?.original ?? undefined,
    characterName: x.character?.name ?? 'Unknown',
    characterImage: x.character?.image?.medium ?? x.character?.image?.original ?? undefined,
  }));
}
