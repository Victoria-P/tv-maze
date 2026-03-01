import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Show } from '@/types/show.type';
import { fetchShowsPage, searchShows } from '@/api/tvmaze';
import {
  filterByName,
  getGenreOrder,
  groupByGenre,
  mapTvMazeShow,
  sortByRatingDesc,
} from '@/utils/show-util';

const fetchIndexPages = async (pages: number): Promise<Show[]> => {
  const results: Show[] = [];
  for (let p = 0; p < pages; p++) {
    const page = await fetchShowsPage(p);
    results.push(...page.map(mapTvMazeShow));
  }
  return results;
};

export const useShowsStore = defineStore('shows', () => {
  // state
  const shows = ref<Show[]>([]);
  const searchQuery = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // derived
  const filtered = computed(() => filterByName(shows.value, searchQuery.value));

  const groupedSorted = computed(() => {
    const grouped = groupByGenre(filtered.value);
    for (const k of Object.keys(grouped)) {
      grouped[k] = sortByRatingDesc(grouped[k] ?? []);
    }
    return grouped;
  });

  const genres = computed(() => getGenreOrder(groupedSorted.value));

  const featuredShow = computed(() => {
    const sorted = [...Object.values(groupedSorted.value).flat()].sort(
      (a, b) => Number(b.rating) - Number(a.rating),
    );
    return sorted[0];
  });

  // actions
  const init = async (pages = 3) => {
    error.value = null;
    isLoading.value = true;

    try {
      shows.value = await fetchIndexPages(pages);
    } catch (e) {
      setError(e);
    } finally {
      isLoading.value = false;
    }
  };

  const resetSearch = () => {
    searchQuery.value = '';
    error.value = null;
  };

  const runRemoteSearch = async (query: string) => {
    const cleaned = query.trim();
    if (!cleaned) return;

    error.value = null;
    isLoading.value = true;

    try {
      const result = await searchShows(cleaned);
      shows.value = result.map(mapTvMazeShow);
    } catch (e) {
      setError(e);
    } finally {
      isLoading.value = false;
    }
  };

  // helpers
  const setError = (e: unknown) => {
    error.value = e instanceof Error ? e.message : 'Unknown error';
  };

  return {
    // state
    shows,
    searchQuery,
    isLoading,
    error,

    // derived
    filtered,
    groupedSorted,
    genres,
    featuredShow,

    // actions
    init,
    resetSearch,
    runRemoteSearch,
  };
});
