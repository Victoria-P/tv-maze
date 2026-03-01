import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchShowsPage, searchShows, fetchShowById, fetchShowCast } from '@/api/tvmaze';
import type { TvMazeShow, TvMazeCastItem } from '@/types/show.type';

describe('tvmaze API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchShowsPage', () => {
    it('should fetch shows for a given page', async () => {
      const mockShows: TvMazeShow[] = [
        {
          id: 1,
          name: 'Breaking Bad',
          genres: ['Drama'],
          rating: { average: 9.5 },
          image: { medium: 'url', original: 'url' },
          summary: 'A show',
          language: 'en',
          premiered: '2008-01-20',
          ended: '2013-09-29',
          status: 'Ended',
          officialSite: 'http://example.com',
          url: 'http://tvmaze.com/shows/1/breaking-bad',
        },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockShows,
      });

      const result = await fetchShowsPage(0);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/shows?page=0',
        undefined,
      );
      expect(result).toEqual(mockShows);
    });

    it('should throw on HTTP error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchShowsPage(0)).rejects.toThrow('TVMaze request failed: 404 Not Found');
    });
  });

  describe('searchShows', () => {
    it('should search for shows by query', async () => {
      const mockResults = [
        {
          score: 0.95,
          show: {
            id: 1,
            name: 'Breaking Bad',
            genres: ['Drama'],
            rating: { average: 9.5 },
            image: null,
            summary: null,
            language: 'en',
            premiered: null,
            ended: null,
            status: 'Ended',
            officialSite: null,
            url: 'http://tvmaze.com/shows/1/breaking-bad',
          },
        },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResults,
      });

      const result = await searchShows('Breaking Bad');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/search/shows?q=Breaking%20Bad',
        undefined,
      );
      expect(result).toEqual(mockResults.map((x) => x.show));
    });

    it('should URL encode the query string', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await searchShows('Breaking Bad & Game of Thrones');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/search/shows?q=Breaking%20Bad%20%26%20Game%20of%20Thrones',
        undefined,
      );
    });
  });

  describe('fetchShowById', () => {
    it('should fetch show details by ID', async () => {
      const mockShow: TvMazeShow = {
        id: 1,
        name: 'Breaking Bad',
        genres: ['Drama', 'Crime'],
        rating: { average: 9.5 },
        image: { medium: 'url', original: 'url' },
        summary: '<p>A show</p>',
        language: 'en',
        premiered: '2008-01-20',
        ended: '2013-09-29',
        status: 'Ended',
        officialSite: 'http://example.com',
        url: 'http://tvmaze.com/shows/1/breaking-bad',
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockShow,
      });

      const result = await fetchShowById(1);

      expect(globalThis.fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1', undefined);
      expect(result).toEqual(mockShow);
    });
  });

  describe('fetchShowCast', () => {
    it('should fetch cast members for a show', async () => {
      const mockCast: TvMazeCastItem[] = [
        {
          person: {
            id: 1,
            name: 'Actor 1',
            image: { medium: 'url', original: 'url' },
          },
          character: {
            id: 100,
            name: 'Character 1',
            image: { medium: 'url', original: 'url' },
          },
          self: false,
          voice: false,
        },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCast,
      });

      const result = await fetchShowCast(1);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/shows/1/cast',
        undefined,
      );
      expect(result).toEqual(mockCast);
    });
  });
});
