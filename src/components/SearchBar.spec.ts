import { mount } from '@vue/test-utils';
import SearchBar from '@/components/SearchBar.vue';

describe('SearchBar', () => {
  it('initialises with the provided modelValue and placeholder', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: 'foo', placeholder: 'Type here' },
    });

    const input = wrapper.get('input');
    expect((input.element as HTMLInputElement).value).toBe('foo');
    expect(input.attributes('placeholder')).toBe('Type here');
  });

  it('emits update:modelValue when user types', async () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: '' },
    });

    const input = wrapper.get('input');
    await input.setValue('bar');

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue']![0]).toEqual(['bar']);
  });
});
