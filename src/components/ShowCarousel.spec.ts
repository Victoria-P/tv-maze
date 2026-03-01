import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import type { Show } from '@/types/show.type';
import ShowCarousel from '@/components/ShowCarousel.vue';

const mockResetToStart = vi.fn();
const mockScrollByPage = vi.fn();
const mockOnScroll = vi.fn();
const mockPage = ref(1);
const mockTotalPages = ref(1);

vi.mock('@/composables/useHorizontalPager', () => ({
  useHorizontalPager: () => ({
    scroller: { value: null },
    page: mockPage,
    totalPages: mockTotalPages,
    onScroll: mockOnScroll,
    scrollByPage: mockScrollByPage,
    resetToStart: mockResetToStart,
  }),
}));

const mockShows: Show[] = [
  {
    id: 1,
    name: 'Show 1',
    genres: ['Drama'],
    rating: '8.5',
    image: { medium: 'url1', original: undefined },
    summaryHtml: 'Summary 1',
    language: 'en',
    premiered: '2020-01-01',
    ended: null,
    status: 'Running',
    officialSite: null,
    url: 'http://tvmaze.com/shows/1',
  },
  {
    id: 2,
    name: 'Show 2',
    genres: ['Comedy'],
    rating: '7.5',
    image: { medium: 'url2', original: undefined },
    summaryHtml: 'Summary 2',
    language: 'en',
    premiered: '2021-01-01',
    ended: null,
    status: 'Running',
    officialSite: null,
    url: 'http://tvmaze.com/shows/2',
  },
];

describe('ShowCarousel', () => {
  it('renders carousel section', () => {
    const wrapper = mount(ShowCarousel, {
      props: { title: 'Drama Shows', shows: mockShows },
      global: {
        stubs: { Card: true },
      },
    });

    expect(wrapper.find('section.carousel-section').exists()).toBe(true);
  });

  it('renders title', () => {
    const wrapper = mount(ShowCarousel, {
      props: { title: 'Action Shows', shows: mockShows },
      global: {
        stubs: { Card: true },
      },
    });

    expect(wrapper.text()).toContain('Action Shows');
  });

  it('renders pagination info', () => {
    const wrapper = mount(ShowCarousel, {
      props: { title: 'Drama Shows', shows: mockShows },
      global: {
        stubs: { Card: true, RouterLink: { template: '<span><slot/></span>' }, BaseButton: true },
      },
    });

    expect(wrapper.find('.carousel-badge').exists()).toBe(true);
  });

  it('renders scroll buttons', () => {
    const wrapper = mount(ShowCarousel, {
      props: { title: 'Drama Shows', shows: mockShows },
      global: {
        stubs: { Card: true, RouterLink: { template: '<span><slot/></span>' }, BaseButton: true },
      },
    });

    const buttons = wrapper.findAllComponents({ name: 'BaseButton' });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders cards for each show', () => {
    const wrapper = mount(ShowCarousel, {
      props: { title: 'Drama Shows', shows: mockShows },
      global: {
        stubs: {
          Card: { template: '<div class="card-stub"></div>' },
          RouterLink: { template: '<span><slot/></span>' },
          BaseButton: true,
        },
      },
    });

    expect(wrapper.findAll('.card-stub').length).toBe(mockShows.length);
  });

  it('has scroller element with role list', () => {
    const wrapper = mount(ShowCarousel, {
      props: { title: 'Drama Shows', shows: mockShows },
      global: {
        stubs: { Card: true, RouterLink: { template: '<span><slot/></span>' }, BaseButton: true },
      },
    });

    const scroller = wrapper.find('[role="list"]');
    expect(scroller.exists()).toBe(true);
  });

  it('handles empty shows array', () => {
    const wrapper = mount(ShowCarousel, {
      props: { title: 'Empty', shows: [] },
      global: {
        stubs: { Card: true, RouterLink: true, BaseButton: true },
      },
    });

    expect(wrapper.find('section.carousel-section').exists()).toBe(true);
  });

  it('calls resetToStart when shows length changes', async () => {
    mockResetToStart.mockClear();

    const newShow = { ...mockShows[0], id: 3 } as Show;
    const wrapper = mount(ShowCarousel, {
      props: { title: 'Reset Test', shows: mockShows },
      global: {
        stubs: { Card: true, RouterLink: { template: '<span><slot/></span>' }, BaseButton: true },
      },
    });

    await wrapper.setProps({ shows: [...mockShows, newShow] });
    await nextTick();

    expect(mockResetToStart).toHaveBeenCalled();
  });

  it('disables navigation buttons appropriately and calls scrollByPage on click', async () => {
    mockPage.value = 1;
    mockTotalPages.value = 2;

    const baseButtonStub = {
      props: ['disabled'],
      template: '<button :disabled="disabled" @click="$emit(\'click\')"></button>',
    };

    const wrapper = mount(ShowCarousel, {
      props: { title: 'Buttons', shows: mockShows },
      global: {
        stubs: {
          Card: true,
          RouterLink: { template: '<span><slot/></span>' },
          BaseButton: baseButtonStub,
        },
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    expect(buttons[0]?.attributes('disabled')).toBeDefined();

    mockScrollByPage.mockClear();
    await buttons[1]?.trigger('click');
    expect(mockScrollByPage).toHaveBeenCalledWith(1);
  });

  it('calls scrollByPage with -1 when left button clicked', async () => {
    mockPage.value = 2;
    mockTotalPages.value = 3;

    const baseButtonStub = {
      props: ['disabled'],
      template: '<button :disabled="disabled" @click="$emit(\'click\')"></button>',
    };

    const wrapper = mount(ShowCarousel, {
      props: { title: 'LeftClick', shows: mockShows },
      global: {
        stubs: {
          Card: true,
          RouterLink: { template: '<span><slot/></span>' },
          BaseButton: baseButtonStub,
        },
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    mockScrollByPage.mockClear();
    await buttons[0]?.trigger('click');
    expect(mockScrollByPage).toHaveBeenCalledWith(-1);
  });

  it('calls onScroll handler when scroller is scrolled', async () => {
    const wrapper = mount(ShowCarousel, {
      props: { title: 'ScrollTest', shows: mockShows },
      global: {
        stubs: { Card: true, RouterLink: { template: '<span><slot/></span>' }, BaseButton: true },
      },
    });

    mockOnScroll.mockClear();
    const scroller = wrapper.find('[role="list"]');
    await scroller.trigger('scroll');
    expect(mockOnScroll).toHaveBeenCalled();
  });
});
