import {
  sortByRatingDesc,
  groupByGenre,
  htmlToText,
  truncateText,
  normalizeQuery,
  filterByName,
  getGenreOrder,
  mapTvMazeShow,
  normalizeRating,
  mapTvMazeCast,
} from './show-util';
import { UNKNOWN_GENRE, type TvMazeCastItem, type TvMazeShow } from '@/types/show.type';

type PartialShow = Partial<{
  id: number;
  name: string;
  genres: string[];
  rating: string;
  [key: string]: unknown;
}>;

function makeShow(partial: PartialShow) {
  return {
    id: 0,
    name: '',
    genres: [],
    rating: '0',
    image: null,
    summaryHtml: '',
    language: null,
    premiered: null,
    ended: null,
    status: null,
    officialSite: null,
    url: '',
    ...partial,
  };
}

describe('show-util helpers', () => {
  describe('sortByRatingDesc', () => {
    it('orders by rating desc, then name, then id', () => {
      const a = makeShow({ id: 1, name: 'b', rating: '5' });
      const b = makeShow({ id: 2, name: 'a', rating: '5' });
      const c = makeShow({ id: 3, name: 'c', rating: '6' });
      const arr = [a, b, c];
      const sorted = sortByRatingDesc(arr);
      expect(sorted.map((s) => s.id)).toEqual([3, 2, 1]);
    });
  });

  describe('groupByGenre', () => {
    it('groups shows under each genre, using OTHER as fallback', () => {
      const s1 = makeShow({ id: 1, genres: ['Drama'] });
      const s2 = makeShow({ id: 2, genres: [] });
      const s3 = makeShow({ id: 3, genres: ['', 'Comedy'] });
      const grouped = groupByGenre([s1, s2, s3]);
      expect(Object.keys(grouped).sort()).toEqual(['Comedy', 'Drama', UNKNOWN_GENRE].sort());
      expect(grouped[UNKNOWN_GENRE]).toContain(s2);
    });
  });

  describe('htmlToText', () => {
    it('strips tags and collapses whitespace', () => {
      expect(htmlToText('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
      expect(htmlToText('')).toBe('');
    });
  });

  describe('truncateText', () => {
    it('does not truncate short strings', () => {
      expect(truncateText('short', 10)).toBe('short');
    });

    it('cuts long text nicely with ellipsis', () => {
      const long = 'a'.repeat(200) + ' end';
      const truncated = truncateText(long, 180);
      expect(truncated.endsWith('…')).toBe(true);
      expect(truncated.length).toBeLessThanOrEqual(181);
    });
  });

  describe('normalizeQuery / filterByName', () => {
    it('normalises casing and whitespace', () => {
      expect(normalizeQuery(' Foo  Bar ')).toBe('foo  bar');
    });

    it('filters by name case insensitively', () => {
      const s1 = makeShow({ id: 1, name: 'One' });
      const s2 = makeShow({ id: 2, name: 'Two' });
      expect(filterByName([s1, s2], 'o')).toEqual([s1, s2]);
      expect(filterByName([s1, s2], 'on')).toEqual([s1]);
      expect(filterByName([s1, s2], '')).toEqual([s1, s2]);
    });
  });

  describe('getGenreOrder', () => {
    it('puts UNKNOWN_GENRE last and sorts others alphabetically', () => {
      const grouped = { Drama: [], [UNKNOWN_GENRE]: [], Action: [] };
      const order = getGenreOrder(grouped);
      expect(order.slice(0, -1)).toEqual(['Action', 'Drama']);
      expect(order[order.length - 1]).toBe(UNKNOWN_GENRE);
    });
  });

  describe('mapTvMazeShow', () => {
    it('maps raw api object to Show shape', () => {
      const raw = {
        id: 10,
        name: 'Foo',
        genres: ['G'],
        rating: { average: 7.2 },
        image: { medium: 'm.jpg', original: null },
        summary: '<p>x</p>',
        language: 'en',
        premiered: null,
        ended: '2020',
        status: 'Ended',
        officialSite: null,
        url: 'http://',
      } as TvMazeShow;
      const mapped = mapTvMazeShow(raw);
      expect(mapped.id).toBe(10);
      expect(mapped.rating).toBe('7.2');
      expect(mapped.summaryHtml).toBe('<p>x</p>');
      expect(mapped.image?.medium).toBe('m.jpg');
    });
  });

  describe('normalizeRating', () => {
    it('should return the number when given a valid number', () => {
      expect(normalizeRating(8.5)).toBe(8.5);
      expect(normalizeRating(0)).toBe(0);
      expect(normalizeRating(10)).toBe(10);
    });

    it('should return 0 when given a non-number value', () => {
      expect(normalizeRating('8')).toBe(0);
      expect(normalizeRating(null)).toBe(0);
      expect(normalizeRating(undefined)).toBe(0);
      expect(normalizeRating({})).toBe(0);
    });

    it('should return 0 when given a non-finite number', () => {
      expect(normalizeRating(Infinity)).toBe(0);
      expect(normalizeRating(-Infinity)).toBe(0);
      expect(normalizeRating(NaN)).toBe(0);
    });
  });

  describe('mapTvMazeCast', () => {
    it('should map TvMazeCastItem array to CastMember array', () => {
      const items: TvMazeCastItem[] = [
        {
          person: {
            id: 1,
            name: 'John Doe',
            image: {
              medium: 'http://example.com/john-medium.jpg',
              original: 'http://example.com/john-original.jpg',
            },
          },
          character: {
            id: 100,
            name: 'Characters Name',
            image: {
              medium: 'http://example.com/char-medium.jpg',
              original: 'http://example.com/char-original.jpg',
            },
          },
          self: false,
          voice: false,
        },
      ];

      const result = mapTvMazeCast(items);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        personId: 1,
        personName: 'John Doe',
        personImage: 'http://example.com/john-medium.jpg',
        characterName: 'Characters Name',
        characterImage: 'http://example.com/char-medium.jpg',
      });
    });

    it('should use original image when medium is not available', () => {
      const items: TvMazeCastItem[] = [
        {
          person: {
            id: 2,
            name: 'Jane Doe',
            image: { original: 'http://example.com/jane-original.jpg' },
          },
          character: {
            id: 101,
            name: 'Jane Char',
            image: { original: 'http://example.com/jane-char-original.jpg' },
          },
          self: false,
          voice: false,
        },
      ];

      const result = mapTvMazeCast(items);

      expect(result[0]).toEqual({
        personId: 2,
        personName: 'Jane Doe',
        personImage: 'http://example.com/jane-original.jpg',
        characterName: 'Jane Char',
        characterImage: 'http://example.com/jane-char-original.jpg',
      });
    });

    it('should handle missing character name', () => {
      const items = [
        {
          person: {
            id: 3,
            name: 'Bob Smith',
            image: null,
          },
          character: {
            id: 102,
            name: null as unknown as string | null,
            image: null,
          },
          self: false,
          voice: false,
        },
      ] as unknown as TvMazeCastItem[];

      const result = mapTvMazeCast(items);

      expect(result[0]).toEqual({
        personId: 3,
        personName: 'Bob Smith',
        characterName: 'Unknown',
        characterImage: undefined,
      });
    });

    it('should handle empty array', () => {
      const result = mapTvMazeCast([]);
      expect(result).toEqual([]);
    });
  });
});
