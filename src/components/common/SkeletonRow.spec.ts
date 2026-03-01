import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SkeletonRow from '@/components/common/SkeletonRow.vue';

describe('SkeletonRow', () => {
  it('renders skeleton loading state', () => {
    const wrapper = mount(SkeletonRow);

    expect(wrapper.find('.wrap').exists()).toBe(true);
  });

  it('renders skeleton bar', () => {
    const wrapper = mount(SkeletonRow);

    expect(wrapper.find('.bar').exists()).toBe(true);
  });

  it('renders skeleton cards', () => {
    const wrapper = mount(SkeletonRow);

    const cards = wrapper.findAll('.card');
    expect(cards.length).toBe(7);
  });

  it('renders cards container', () => {
    const wrapper = mount(SkeletonRow);

    expect(wrapper.find('.cards').exists()).toBe(true);
  });

  it('has correct structure', () => {
    const wrapper = mount(SkeletonRow);

    const wrap = wrapper.find('.wrap');
    expect(wrap.exists()).toBe(true);
    expect(wrap.find('.bar').exists()).toBe(true);
    expect(wrap.find('.cards').exists()).toBe(true);
  });

  it('displays as placeholder component', () => {
    const wrapper = mount(SkeletonRow);

    expect(wrapper.find('.bar').exists()).toBe(true);
    expect(wrapper.findAll('.card').length).toBe(7);
  });
});
