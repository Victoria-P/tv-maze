import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Breadcrumbs from '@/components/common/Breadcrumbs.vue';
import { createRouter, createMemoryHistory } from 'vue-router';

describe('Breadcrumbs', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div></div>' } },
      { path: '/shows', component: { template: '<div></div>' } },
      { path: '/shows/:id', component: { template: '<div></div>' } },
    ],
  });

  it('renders breadcrumb navigation', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [
          { label: 'Home', to: '/' },
          { label: 'Shows', to: '/shows' },
          { label: 'Breaking Bad' },
        ],
      },
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('nav.bc').exists()).toBe(true);
    expect(wrapper.find('nav[aria-label="Breadcrumb"]').exists()).toBe(true);
  });

  it('renders list with correct number of items', () => {
    const items = [
      { label: 'Home', to: '/' },
      { label: 'Shows', to: '/shows' },
      { label: 'Current' },
    ];

    const wrapper = mount(Breadcrumbs, {
      props: { items },
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.findAll('li.item').length).toBe(3);
  });

  it('renders links for items with to prop', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [{ label: 'Home', to: '/' }, { label: 'Shows' }],
      },
      global: {
        plugins: [router],
      },
    });

    const links = wrapper.findAllComponents({ name: 'RouterLink' });
    expect(links.length).toBe(1);
    expect(links[0]!.props('to')).toBe('/');
  });

  it('renders span for items without to prop', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [{ label: 'Home', to: '/' }, { label: 'Current' }],
      },
      global: {
        plugins: [router],
      },
    });

    const spans = wrapper.findAll('span.current');
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0]!.text()).toBe('Current');
  });

  it('marks last item as current page', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [
          { label: 'Home', to: '/' },
          { label: 'Shows', to: '/shows' },
          { label: 'Breaking Bad' },
        ],
      },
      global: {
        plugins: [router],
      },
    });

    const current = wrapper.find('span[aria-current="page"]');
    expect(current.exists()).toBe(true);
    expect(current.text()).toBe('Breaking Bad');
  });

  it('renders separators between items', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [{ label: 'Home', to: '/' }, { label: 'Shows' }, { label: 'Show' }],
      },
      global: {
        plugins: [router],
      },
    });

    const separators = wrapper.findAll('span.sep');
    expect(separators.length).toBe(2);
  });

  it('does not render separator after last item', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [{ label: 'Home', to: '/' }, { label: 'Current' }],
      },
      global: {
        plugins: [router],
      },
    });

    const items = wrapper.findAll('li.item');
    const lastItem = items[items.length - 1];
    expect(lastItem?.find('span.sep').exists()).toBe(false);
  });

  it('handles empty items array', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { items: [] },
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('nav.bc').exists()).toBe(true);
    expect(wrapper.findAll('li.item').length).toBe(0);
  });

  it('has aria-hidden separator', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [{ label: 'Home', to: '/' }, { label: 'Current' }],
      },
      global: {
        plugins: [router],
      },
    });

    const sep = wrapper.find('span.sep');
    expect(sep.attributes('aria-hidden')).toBe('true');
  });
});
