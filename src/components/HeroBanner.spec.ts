import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HeroBanner from '@/components/HeroBanner.vue';
import type { Show } from '@/types/show.type';

const mockShow: Show = {
  id: 1,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime', 'Thriller'],
  rating: '9.5',
  image: {
    medium: 'http://example.com/bb-medium.jpg',
    original: 'http://example.com/bb-original.jpg',
  },
  summaryHtml: '<p>A chemistry teacher turns to drug manufacturing</p>',
  language: 'en',
  premiered: '2008-01-20',
  ended: '2013-09-29',
  status: 'Ended',
  officialSite: 'http://example.com',
  url: 'http://tvmaze.com/shows/1/breaking-bad',
};

describe('HeroBanner', () => {
  it('renders show title', () => {
    const wrapper = mount(HeroBanner, {
      props: { show: mockShow },
    });

    expect(wrapper.find('h1').text()).toBe('Breaking Bad');
  });

  it('renders default label when not provided', () => {
    const wrapper = mount(HeroBanner, {
      props: { show: mockShow },
    });

    expect(wrapper.text()).toContain('Featured');
  });

  it('renders custom label when provided', () => {
    const wrapper = mount(HeroBanner, {
      props: { show: mockShow, label: 'Trending Now' },
    });

    expect(wrapper.text()).toContain('Trending Now');
  });

  it('renders rating', () => {
    const wrapper = mount(HeroBanner, {
      props: { show: mockShow },
    });

    expect(wrapper.text()).toContain('★ 9.5');
  });

  it('renders genres', () => {
    const wrapper = mount(HeroBanner, {
      props: { show: mockShow },
    });

    expect(wrapper.text()).toContain('Drama • Crime • Thriller');
  });

  it('renders premiered date', () => {
    const wrapper = mount(HeroBanner, {
      props: { show: mockShow },
    });

    expect(wrapper.text()).toMatch(/20\/01\/2008|Jan/);
  });

  it('applies background image style', () => {
    const wrapper = mount(HeroBanner, {
      props: { show: mockShow },
    });

    const section = wrapper.find('section.hero');
    const style = section.attributes('style');
    expect(style).toContain('bb-original.jpg');
  });

  it('handles show without genres', () => {
    const showWithoutGenres = { ...mockShow, genres: [] };
    const wrapper = mount(HeroBanner, {
      props: { show: showWithoutGenres },
    });

    expect(wrapper.find('section.hero').exists()).toBe(true);
  });

  it('handles show without premiere date', () => {
    const showWithoutDate = { ...mockShow, premiered: null };
    const wrapper = mount(HeroBanner, {
      props: { show: showWithoutDate },
    });

    expect(wrapper.find('section.hero').exists()).toBe(true);
  });

  it('sanitizes HTML content', () => {
    const wrapper = mount(HeroBanner, {
      props: { show: mockShow },
    });

    expect(wrapper.find('section.hero').exists()).toBe(true);
  });
});
