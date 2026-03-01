import type { TvMazeCastItem, TvMazeSearchItem, TvMazeShow } from '@/types/show.type';

const BASE_URL = 'https://api.tvmaze.com';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const msg = `TVMaze request failed: ${res.status} ${res.statusText} for ${path}`;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

/** Show index endpoint: /shows?page=:num (max 250/page). */
export function fetchShowsPage(page: number): Promise<TvMazeShow[]> {
  return http<TvMazeShow[]>(`/shows?page=${page}`);
}

/** Search endpoint: /search/shows?q=:query */
export async function searchShows(query: string): Promise<TvMazeShow[]> {
  const items = await http<TvMazeSearchItem[]>(`/search/shows?q=${encodeURIComponent(query)}`);
  return items.map((x) => x.show);
}

/** Show details endpoint: /shows/:id */
export function fetchShowById(id: number): Promise<TvMazeShow> {
  return http<TvMazeShow>(`/shows/${id}`);
}

export function fetchShowCast(id: number): Promise<TvMazeCastItem[]> {
  return http<TvMazeCastItem[]>(`/shows/${id}/cast`);
}
