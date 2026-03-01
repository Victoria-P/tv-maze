import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from '@/components/common/Card.vue';

describe('Card', () => {
  it('renders card wrapper with aria-label', () => {
    const wrapper = mount(Card, {
      props: { name: 'Breaking Bad', img: 'url' },
      global: {
        stubs: { Badge: true },
      },
    });

    expect(wrapper.find('[aria-label]').exists()).toBe(true);
    expect(wrapper.find('[aria-label]').attributes('aria-label')).toBe('Breaking Bad');
  });

  it('renders image when provided', () => {
    const wrapper = mount(Card, {
      props: { name: 'Breaking Bad', img: 'http://example.com/image.jpg' },
      global: {
        stubs: { Badge: true },
      },
    });

    const img = wrapper.find('img.poster');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('http://example.com/image.jpg');
    expect(img.attributes('alt')).toBe('Breaking Bad');
  });

  it('renders fallback text when no image', () => {
    const wrapper = mount(Card, {
      props: { name: 'Breaking Bad' },
      global: {
        stubs: { Badge: true },
      },
    });

    expect(wrapper.find('.fallback').text()).toBe('No image');
  });

  it('renders image with loading and decoding attributes', () => {
    const wrapper = mount(Card, {
      props: { name: 'Show', img: 'url' },
      global: {
        stubs: { Badge: true },
      },
    });

    const img = wrapper.find('img');
    expect(img.attributes('loading')).toBe('lazy');
    expect(img.attributes('decoding')).toBe('async');
  });

  it('renders show name', () => {
    const wrapper = mount(Card, {
      props: { name: 'Breaking Bad', img: 'url' },
      global: {
        stubs: { Badge: true },
      },
    });

    expect(wrapper.find('.name').text()).toBe('Breaking Bad');
  });

  it('renders badge when badgeLabel provided', () => {
    const wrapper = mount(Card, {
      props: { name: 'Breaking Bad', badgeLabel: '9.5', img: 'url' },
      global: {
        stubs: { Badge: true },
      },
    });

    const badge = wrapper.findComponent({ name: 'Badge' });
    expect(badge.exists()).toBe(true);
    expect(badge.props('label')).toBe('9.5');
  });

  it('does not render badge when badgeLabel not provided', () => {
    const wrapper = mount(Card, {
      props: { name: 'Breaking Bad', img: 'url' },
      global: {
        stubs: { Badge: true },
      },
    });

    expect(wrapper.findComponent({ name: 'Badge' }).exists()).toBe(false);
  });

  it('has correct structure', () => {
    const wrapper = mount(Card, {
      props: { name: 'Show', img: 'url' },
      global: {
        stubs: { Badge: true },
      },
    });

    expect(wrapper.find('.card-wrapper').exists()).toBe(true);
    expect(wrapper.find('.card').exists()).toBe(true);
    expect(wrapper.find('.name').exists()).toBe(true);
  });
});
