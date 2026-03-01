import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ShowDetails from '@/components/ShowDetails.vue';
import type { Show, CastMember } from '@/types/show.type';

const mockShow: Show = {
  id: 1,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime'],
  rating: '9.5',
  image: { medium: 'url', original: 'url' },
  summaryHtml: '<p>A show about chemistry</p>',
  language: 'en',
  premiered: '2008-01-20',
  ended: '2013-09-29',
  status: 'Ended',
  officialSite: 'http://example.com',
  url: 'http://tvmaze.com/shows/1/breaking-bad',
};

const mockCast: CastMember[] = [
  {
    personId: 1,
    personName: 'Actor 1',
    personImage: 'image1.jpg',
    characterName: 'Character 1',
    characterImage: 'char1.jpg',
  },
  {
    personId: 2,
    personName: 'Actor 2',
    characterName: 'Character 2',
  },
];

describe('ShowDetails', () => {
  it('renders show title', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: [] },
      global: {
        stubs: { Badge: true, AvatarCard: true, BaseButton: true, RouterLink: true },
      },
    });

    expect(wrapper.find('h1').text()).toBe('Breaking Bad');
  });

  it('renders show rating', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: [] },
      global: {
        stubs: { Badge: true, AvatarCard: true, BaseButton: true, RouterLink: true },
      },
    });

    expect(wrapper.findComponent({ name: 'Badge' }).exists()).toBe(true);
  });

  it('renders show status', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: [] },
      global: {
        stubs: { Badge: true, AvatarCard: true, BaseButton: true, RouterLink: true },
      },
    });

    expect(wrapper.text()).toContain('Ended');
  });

  it('renders show language', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: [] },
      global: {
        stubs: { Badge: true, AvatarCard: true, BaseButton: true, RouterLink: true },
      },
    });

    expect(wrapper.text()).toContain('en');
  });

  it('renders premiere date', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: [] },
      global: {
        stubs: { Badge: true, AvatarCard: true, BaseButton: true, RouterLink: true },
      },
    });

    expect(wrapper.text()).toContain('Premiered');
  });

  it('renders genres as badges', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: [] },
      global: {
        stubs: { Badge: true, AvatarCard: true, BaseButton: true, RouterLink: true },
      },
    });

    const badgeComponents = wrapper.findAllComponents({ name: 'Badge' });
    expect(badgeComponents.length).toBe(3);
  });

  it('renders cast section when cast exists', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: mockCast },
      global: {
        stubs: { Badge: true, AvatarCard: true, BaseButton: true, RouterLink: true },
      },
    });

    expect(wrapper.text()).toContain('Cast');
    const avatarCards = wrapper.findAllComponents({ name: 'AvatarCard' });
    expect(avatarCards.length).toBe(mockCast.length);
  });

  it('does not render cast section when cast is empty', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: [] },
      global: {
        stubs: { Badge: true, AvatarCard: true, BaseButton: true, RouterLink: true },
      },
    });

    expect(wrapper.text()).not.toContain('Cast');
  });

  it('renders back button', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: [] },
      global: {
        stubs: { Badge: true, AvatarCard: true, RouterLink: true },
      },
    });

    const button = wrapper.findComponent({ name: 'BaseButton' });
    expect(button.exists()).toBe(true);
  });

  it('renders sanitized summary', () => {
    const wrapper = mount(ShowDetails, {
      props: { show: mockShow, cast: [] },
      global: {
        stubs: { Badge: true, AvatarCard: true, BaseButton: true, RouterLink: true },
      },
    });

    expect(wrapper.find('.text-summary').exists()).toBe(true);
  });
});
