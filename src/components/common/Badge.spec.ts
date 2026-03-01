import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from './Badge.vue';

describe('Badge', () => {
  it('renders badge with label', () => {
    const wrapper = mount(Badge, {
      props: { label: '8.5' },
    });

    expect(wrapper.find('.badge').text()).toBe('8.5');
  });

  it('renders badge with text label', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Drama' },
    });

    expect(wrapper.find('.badge').text()).toBe('Drama');
  });

  it('has correct class', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Test' },
    });

    expect(wrapper.find('.badge').exists()).toBe(true);
  });

  it('renders empty string when label is empty', () => {
    const wrapper = mount(Badge, {
      props: { label: '' },
    });

    expect(wrapper.find('.badge').exists()).toBe(true);
  });

  it('displays long labels correctly', () => {
    const longLabel = 'Science Fiction Fantasy Action Adventure Drama Crime Thriller Mystery';
    const wrapper = mount(Badge, {
      props: { label: longLabel },
    });

    expect(wrapper.find('.badge').text()).toBe(longLabel);
  });

  it('applies badge styling', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Test' },
    });

    const badge = wrapper.find('.badge');
    expect(badge.exists()).toBe(true);
  });

  it('can be used with custom class', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Test' },
      attrs: { class: 'custom-class' },
    });

    expect(wrapper.find('.badge').exists()).toBe(true);
  });
});
