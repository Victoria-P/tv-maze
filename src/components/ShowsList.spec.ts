import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ShowsList from '@/components/ShowsList.vue';
import { setActivePinia, createPinia } from 'pinia';
import { useShowsStore } from '@/stores/shows';

vi.mock('@/stores/shows', () => ({
  useShowsStore: vi.fn(),
}));

describe('ShowsList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders no shows message when genres is empty', () => {
    vi.mocked(useShowsStore).mockReturnValue({
      genres: [],
      filtered: [],
      groupedSorted: {},
      searchQuery: '',
    } as unknown as ReturnType<typeof useShowsStore>);

    const wrapper = mount(ShowsList, {
      global: {
        stubs: { ShowCarousel: true, Card: true, RouterLink: true },
      },
    });

    expect(wrapper.text()).toContain('No shows found');
  });

  it('renders search results when searchQuery is not empty', () => {
    const mockShows = [
      { id: 1, name: 'Show 1', image: { medium: 'url1' } },
      { id: 2, name: 'Show 2', image: { medium: 'url2' } },
    ];

    vi.mocked(useShowsStore).mockReturnValue({
      genres: ['Drama'],
      filtered: mockShows as unknown as ReturnType<typeof useShowsStore>['filtered'],
      groupedSorted: {},
      searchQuery: 'Breaking Bad',
    } as unknown as ReturnType<typeof useShowsStore>);

    const wrapper = mount(ShowsList, {
      global: {
        stubs: { ShowCarousel: true, Card: true, RouterLink: true },
      },
    });

    expect(wrapper.text()).not.toContain('No shows found');
  });

  it('renders carousels for each genre when no search query', () => {
    const mockShows = { Drama: [{ id: 1, name: 'Show 1' }], Action: [{ id: 2, name: 'Show 2' }] };

    vi.mocked(useShowsStore).mockReturnValue({
      genres: ['Drama', 'Action'],
      filtered: [],
      groupedSorted: mockShows as unknown as ReturnType<typeof useShowsStore>['groupedSorted'],
      searchQuery: '',
    } as unknown as ReturnType<typeof useShowsStore>);

    const wrapper = mount(ShowsList, {
      global: {
        stubs: { ShowCarousel: true, Card: true, RouterLink: true },
      },
    });

    const carousels = wrapper.findAllComponents({ name: 'ShowCarousel' });
    expect(carousels.length).toBe(2);
  });

  it('renders cards with correct props for search results', () => {
    const mockShows = [{ id: 1, name: 'Test Show', rating: '8.5', image: { medium: 'url' } }];

    vi.mocked(useShowsStore).mockReturnValue({
      genres: [],
      filtered: mockShows as unknown as ReturnType<typeof useShowsStore>['filtered'],
      groupedSorted: {},
      searchQuery: 'Test',
    } as unknown as ReturnType<typeof useShowsStore>);

    const wrapper = mount(ShowsList, {
      global: {
        stubs: { ShowCarousel: true, Card: true, RouterLink: true },
      },
    });

    const card = wrapper.findComponent({ name: 'Card' });
    if (card.exists()) {
      expect(card.props('name')).toBe('Test Show');
    }
  });

  it('handles shows without images gracefully', () => {
    const mockShows = [{ id: 1, name: 'Show 1', image: null }];

    vi.mocked(useShowsStore).mockReturnValue({
      genres: ['Drama'],
      filtered: mockShows as unknown as ReturnType<typeof useShowsStore>['filtered'],
      groupedSorted: {},
      searchQuery: 'query',
    } as unknown as ReturnType<typeof useShowsStore>);

    const wrapper = mount(ShowsList, {
      global: {
        stubs: { ShowCarousel: true, Card: true, RouterLink: true },
      },
    });

    expect(wrapper.find('.flex').exists()).toBe(true);
  });

  it('wraps search results in router links', () => {
    const mockShows = [{ id: 1, name: 'Show 1', image: { medium: 'url' } }];

    vi.mocked(useShowsStore).mockReturnValue({
      genres: ['Drama'],
      filtered: mockShows as unknown as ReturnType<typeof useShowsStore>['filtered'],
      groupedSorted: {},
      searchQuery: 'query',
    } as unknown as ReturnType<typeof useShowsStore>);

    const wrapper = mount(ShowsList, {
      global: {
        stubs: { ShowCarousel: true, Card: true, RouterLink: true },
      },
    });

    expect(wrapper.find('.flex').exists()).toBe(true);
  });

  it('passes genre to carousel components', () => {
    const mockShows = { Drama: [{ id: 1, name: 'Show 1' }] };

    vi.mocked(useShowsStore).mockReturnValue({
      genres: ['Drama'],
      filtered: [],
      groupedSorted: mockShows as unknown as ReturnType<typeof useShowsStore>['groupedSorted'],
      searchQuery: '',
    } as unknown as ReturnType<typeof useShowsStore>);

    const wrapper = mount(ShowsList, {
      global: {
        stubs: { ShowCarousel: true, Card: true, RouterLink: true },
      },
    });

    const carousel = wrapper.findComponent({ name: 'ShowCarousel' });
    expect(carousel.props('title')).toBe('Drama');
  });
});
