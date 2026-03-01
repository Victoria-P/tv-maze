import { mount } from '@vue/test-utils';
import BaseButton from '@/components/common/BaseButton.vue';

describe('BaseButton', () => {
  it('renders as a native button by default and shows slot content', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Click me' } });
    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.text()).toBe('Click me');
    expect(wrapper.classes()).toContain('btn--primary');
    expect(wrapper.classes()).toContain('btn--md');
  });

  it('applies variant and size classes from props', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'outline', size: 'lg' },
      slots: { default: 'Hello' },
    });
    expect(wrapper.classes()).toContain('btn--outline');
    expect(wrapper.classes()).toContain('btn--lg');
  });

  it('renders an anchor when href is provided', () => {
    const wrapper = mount(BaseButton, {
      props: { href: 'https://example.com' },
      slots: { default: 'Link' },
    });
    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('href')).toBe('https://example.com');
  });

  it('stubs router-link when "to" prop is provided', () => {
    const wrapper = mount(BaseButton, {
      props: { to: '/foo' },
      slots: { default: 'Router Link' },
      global: { stubs: ['router-link'] },
    });
    expect(wrapper.find('router-link-stub').exists()).toBe(true);
    expect(wrapper.find('router-link-stub').attributes('to')).toBe('/foo');
  });

  it('disables navigation when disabled and sets aria/tabindex correctly', async () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true, href: 'https://example.com' },
      slots: { default: 'Disabled' },
      global: { stubs: ['router-link'] },
    });

    expect(wrapper.attributes('href')).toBeUndefined();
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('tabindex')).toBe('-1');

    await wrapper.trigger('click');
    expect(wrapper.attributes('href')).toBeUndefined();
  });
});
