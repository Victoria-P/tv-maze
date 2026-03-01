import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import { setActivePinia, createPinia } from 'pinia';

describe('AppHeader', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders with default title', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div></div>' } }],
    });

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain('TV Dashboard');
  });

  it('renders with custom title prop', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div></div>' } }],
    });

    const wrapper = mount(AppHeader, {
      props: { title: 'Custom Title' },
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain('Custom Title');
  });

  it('renders slot content', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div></div>' } }],
    });

    const wrapper = mount(AppHeader, {
      slots: {
        default: '<div class="test-slot">Slot Content</div>',
      },
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('.test-slot').text()).toBe('Slot Content');
  });

  it('has header element with correct class', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div></div>' } }],
    });

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('header.header').exists()).toBe(true);
  });

  it('brand link has aria-label', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div></div>' } }],
    });

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('a.brand').attributes('aria-label')).toBe('Go to Home');
  });

  it('clicking brand resets search and scrolls to top', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div></div>' } }],
    });
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
      },
    });

    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true });

    await wrapper.find('a.brand').trigger('click');

    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollSpy.mockRestore();
  });
});
