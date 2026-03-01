import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useShowsStore } from '@/stores/shows';
import * as tvmazeApi from '@/api/tvmaze';
import type { TvMazeShow } from '@/types/show.type';

vi.mock('@/api/tvmaze', () => ({
  fetchShowsPage: vi.fn(),
  searchShows: vi.fn(),
}));

const mockTvMazeShow: TvMazeShow = {
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
};

describe('shows store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have initial state', () => {
      const store = useShowsStore();

      expect(store.shows).toEqual([]);
      expect(store.searchQuery).toBe('');
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });
  });

  describe('init action', () => {
    it('should fetch and load shows', async () => {
      const mockShows = [mockTvMazeShow, { ...mockTvMazeShow, id: 2, name: 'Game of Thrones' }];

      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(mockShows);

      const store = useShowsStore();
      await store.init(1);

      expect(store.shows).toHaveLength(2);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('should fetch multiple pages', async () => {
      const page1 = [mockTvMazeShow];
      const page2 = [{ ...mockTvMazeShow, id: 2, name: 'Show 2' }];

      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValueOnce(page1).mockResolvedValueOnce(page2);

      const store = useShowsStore();
      await store.init(2);

      expect(store.shows).toHaveLength(2);
      expect(vi.mocked(tvmazeApi.fetchShowsPage)).toHaveBeenCalledTimes(2);
    });

    it('should handle errors', async () => {
      const error = new Error('API Error');
      vi.mocked(tvmazeApi.fetchShowsPage).mockRejectedValue(error);

      const store = useShowsStore();
      await store.init(1);

      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('API Error');
      expect(store.shows).toEqual([]);
    });

    it('should handle non-Error objects', async () => {
      vi.mocked(tvmazeApi.fetchShowsPage).mockRejectedValue('String error');

      const store = useShowsStore();
      await store.init(1);

      expect(store.error).toBe('Unknown error');
    });
  });

  describe('runRemoteSearch action', () => {
    it('should search for shows', async () => {
      const mockResults = [mockTvMazeShow];
      vi.mocked(tvmazeApi.searchShows).mockResolvedValue(mockResults);

      const store = useShowsStore();
      await store.runRemoteSearch('Breaking Bad');

      expect(store.shows).toEqual(
        mockResults.map((s) => expect.objectContaining({ id: s.id, name: s.name })),
      );
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('should ignore empty queries', async () => {
      const store = useShowsStore();
      await store.runRemoteSearch('   ');

      expect(vi.mocked(tvmazeApi.searchShows)).not.toHaveBeenCalled();
    });

    it('should handle search errors', async () => {
      const error = new Error('Search failed');
      vi.mocked(tvmazeApi.searchShows).mockRejectedValue(error);

      const store = useShowsStore();
      await store.runRemoteSearch('Breaking Bad');

      expect(store.error).toBe('Search failed');
      expect(store.shows).toEqual([]);
    });
  });

  describe('resetSearch action', () => {
    it('should clear search query and error', () => {
      const store = useShowsStore();
      store.searchQuery = 'test';
      store.error = 'Error message';

      store.resetSearch();

      expect(store.searchQuery).toBe('');
      expect(store.error).toBe(null);
    });
  });

  describe('computed properties', () => {
    it('should filter shows by search query', async () => {
      const shows = [mockTvMazeShow, { ...mockTvMazeShow, id: 2, name: 'Game of Thrones' }];

      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(shows);

      const store = useShowsStore();
      await store.init(1);

      store.searchQuery = 'breaking';
      expect(store.filtered).toHaveLength(1);
      expect(store.filtered[0]?.name).toBe('Breaking Bad');
    });

    it('should group shows by genre', async () => {
      const shows = [
        mockTvMazeShow,
        { ...mockTvMazeShow, id: 2, name: 'The Comedy', genres: ['Comedy'] },
      ];

      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(shows);

      const store = useShowsStore();
      await store.init(1);

      expect(Object.keys(store.groupedSorted).sort()).toEqual(['Comedy', 'Drama']);
    });

    it('should sort genres with Other last', async () => {
      const shows = [
        mockTvMazeShow,
        { ...mockTvMazeShow, id: 2, name: 'Unknown Genre Show', genres: [] },
        { ...mockTvMazeShow, id: 3, name: 'Action Show', genres: ['Action'] },
      ];

      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(shows);

      const store = useShowsStore();
      await store.init(1);

      const genres = store.genres;
      expect(genres[genres.length - 1]).toBe('Other');
    });

    it('should identify featured show as highest rated', async () => {
      const shows = [
        mockTvMazeShow,
        { ...mockTvMazeShow, id: 2, name: 'Low Rating', rating: { average: 6.0 } },
      ];

      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(shows);

      const store = useShowsStore();
      await store.init(1);

      expect(store.featuredShow?.id).toBe(1);
      expect(store.featuredShow?.name).toBe('Breaking Bad');
    });
  });
});
