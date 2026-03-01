import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvatarCard from '@/components/common/AvatarCard.vue';

describe('AvatarCard', () => {
  it('renders primary text', () => {
    const wrapper = mount(AvatarCard, {
      props: { primaryText: 'Bryan Cranston' },
    });

    expect(wrapper.find('.primary-text').text()).toBe('Bryan Cranston');
  });

  it('renders secondary text when provided', () => {
    const wrapper = mount(AvatarCard, {
      props: {
        primaryText: 'Bryan Cranston',
        secondaryText: 'as Walter White',
      },
    });

    expect(wrapper.find('.secondary-text').text()).toBe('as Walter White');
  });

  it('renders avatar image when provided', () => {
    const wrapper = mount(AvatarCard, {
      props: {
        primaryText: 'Actor',
        img: 'http://example.com/avatar.jpg',
      },
    });

    const img = wrapper.find('.avatar img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('http://example.com/avatar.jpg');
    expect(img.attributes('alt')).toBe('Actor');
  });

  it('renders avatar fallback emoji when no image', () => {
    const wrapper = mount(AvatarCard, {
      props: { primaryText: 'Actor' },
    });

    const fallback = wrapper.find('.avatar-fallback');
    expect(fallback.exists()).toBe(true);
    expect(fallback.text()).toBe('👤');
  });

  it('has correct structure', () => {
    const wrapper = mount(AvatarCard, {
      props: { primaryText: 'Test' },
    });

    expect(wrapper.find('.avatar-card').exists()).toBe(true);
    expect(wrapper.find('.avatar').exists()).toBe(true);
    expect(wrapper.find('.primary-text').exists()).toBe(true);
  });

  it('renders with all props', () => {
    const wrapper = mount(AvatarCard, {
      props: {
        primaryText: 'Bryan Cranston',
        secondaryText: 'as Walter White',
        img: 'avatar.jpg',
      },
    });

    expect(wrapper.find('.primary-text').text()).toBe('Bryan Cranston');
    expect(wrapper.find('.secondary-text').text()).toBe('as Walter White');
    expect(wrapper.find('.avatar img').exists()).toBe(true);
  });

  it('image has lazy loading attribute', () => {
    const wrapper = mount(AvatarCard, {
      props: {
        primaryText: 'Actor',
        img: 'avatar.jpg',
      },
    });

    const img = wrapper.find('.avatar img');
    expect(img.attributes('loading')).toBe('lazy');
  });

  it('truncates long text correctly', () => {
    const longName = 'Very Long Actor Name That Should Be Truncated With Ellipsis Text Overflow';
    const wrapper = mount(AvatarCard, {
      props: { primaryText: longName },
    });

    const primaryText = wrapper.find('.primary-text');
    expect(primaryText.exists()).toBe(true);
    expect(primaryText.classes()).toContain('primary-text');
  });

  it('does not render secondary text when not provided', () => {
    const wrapper = mount(AvatarCard, {
      props: { primaryText: 'Actor' },
    });

    expect(wrapper.find('.secondary-text').text()).toBe('');
  });
});
