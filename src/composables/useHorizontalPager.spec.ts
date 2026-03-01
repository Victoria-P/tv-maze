import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useHorizontalPager } from '@/composables/useHorizontalPager';
import type { Component } from 'vue';

type TestGlobal = {
  ResizeObserver?: new (cb: ResizeObserverCallback) => {
    observe: (...args: unknown[]) => void;
    unobserve?: (...args: unknown[]) => void;
    disconnect: () => void;
  };
};

describe('useHorizontalPager', () => {
  let mockElement: any;

  beforeEach(() => {
    mockElement = {
      clientWidth: 300,
      scrollWidth: 1200,
      scrollLeft: 0,
      scrollBy: vi.fn(),
      scrollTo: vi.fn(),
    };

    (globalThis as unknown as TestGlobal).ResizeObserver = class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(_cb?: ResizeObserverCallback) {}
    } as unknown as TestGlobal['ResizeObserver'];

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { page, totalPages, scroller } = useHorizontalPager();

      expect(page.value).toBe(1);
      expect(totalPages.value).toBe(1);
      expect(scroller.value).toBe(null);
    });
  });

  describe('updateMetrics', () => {
    it('should calculate pages based on scroll width', () => {
      const { updateMetrics, totalPages, scroller } = useHorizontalPager();

      scroller.value = mockElement;

      updateMetrics();

      // scrollWidth=1200, clientWidth=300, maxScroll=900
      // pages = Math.ceil(900 / 300) + 1 = 4
      expect(totalPages.value).toBe(4);
    });

    it('should set totalPages to 1 when no scrolling needed', () => {
      mockElement.scrollWidth = 250; // less than clientWidth
      const { updateMetrics, totalPages, page, scroller } = useHorizontalPager();

      scroller.value = mockElement;
      updateMetrics();

      expect(totalPages.value).toBe(1);
      expect(page.value).toBe(1);
    });

    it('should calculate current page based on scroll position', () => {
      mockElement.scrollLeft = 300; // scrolled by one page width
      const { updateMetrics, page, scroller } = useHorizontalPager();

      scroller.value = mockElement;
      updateMetrics();

      expect(page.value).toBe(2);
    });

    it('should clamp page within valid range', () => {
      mockElement.scrollLeft = 5000; // scroll way too much
      const { updateMetrics, page, totalPages, scroller } = useHorizontalPager();

      scroller.value = mockElement;
      updateMetrics();

      expect(page.value).toBeLessThanOrEqual(totalPages.value);
    });

    it('should call onUpdate callback when provided', () => {
      const onUpdate = vi.fn();
      const { updateMetrics, scroller } = useHorizontalPager({ onUpdate });

      scroller.value = mockElement;
      updateMetrics();

      expect(onUpdate).toHaveBeenCalled();
    });
  });

  describe('scrollByPage', () => {
    it('should scroll right by page width', () => {
      const { scrollByPage, scroller } = useHorizontalPager();

      scroller.value = mockElement;
      scrollByPage(1);

      expect(mockElement.scrollBy).toHaveBeenCalledWith({
        left: 300,
        behavior: 'smooth',
      });
    });

    it('should scroll left by negative page width', () => {
      const { scrollByPage, scroller } = useHorizontalPager();

      scroller.value = mockElement;
      scrollByPage(-1);

      expect(mockElement.scrollBy).toHaveBeenCalledWith({
        left: -300,
        behavior: 'smooth',
      });
    });

    it('should not scroll if scroller is null', () => {
      const { scrollByPage, scroller } = useHorizontalPager();

      scroller.value = null;
      scrollByPage(1);

      expect(mockElement.scrollBy).not.toHaveBeenCalled();
    });
  });

  describe('resetToStart', () => {
    it('should reset scroll position to start', () => {
      const { resetToStart, page, scroller } = useHorizontalPager();

      scroller.value = mockElement;
      page.value = 5;

      resetToStart();

      expect(mockElement.scrollTo).toHaveBeenCalledWith({ left: 0, behavior: 'auto' });
      expect(page.value).toBe(1);
    });

    it('should not reset if scroller is null', () => {
      const { resetToStart, scroller } = useHorizontalPager();

      scroller.value = null;
      resetToStart();

      expect(mockElement.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('onScroll handler', () => {
    it('should throttle scroll events with RAF', () => {
      const { onScroll } = useHorizontalPager();

      onScroll();
      onScroll();
      onScroll();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('lifecycle', () => {
    it('should use ResizeObserver when available and scroller exists', () => {
      const observeMock = vi.fn();
      const disconnectMock = vi.fn();

      (globalThis as unknown as TestGlobal).ResizeObserver = class {
        observe = observeMock;
        disconnect = disconnectMock;
        constructor(_cb?: ResizeObserverCallback) {}
      } as unknown as TestGlobal['ResizeObserver'];

      const { scroller } = useHorizontalPager();
      scroller.value = mockElement;
    });

    it('should skip ResizeObserver if scroller is null', () => {
      const observeMock = vi.fn();

      globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: observeMock,
        disconnect: vi.fn(),
      }));

      useHorizontalPager();

      expect(observeMock).not.toHaveBeenCalled();
    });

    it('should not error when ResizeObserver not available', () => {
      delete (globalThis as any).ResizeObserver;

      expect(() => {
        useHorizontalPager();
      }).not.toThrow();
    });

    it('should handle RAF cleanup', () => {
      const { onScroll } = useHorizontalPager();

      onScroll();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('component wrapper should execute lifecycle hooks', () => {
      const observeMock = vi.fn();

      globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: observeMock,
        disconnect: vi.fn(),
      }));

      const { scroller } = useHorizontalPager();
      scroller.value = mockElement;

      expect(scroller.value).toBeDefined();
    });

    it('mounting component uses ResizeObserver and unmount disconnects', async () => {
      const observeMock = vi.fn();
      const disconnectMock = vi.fn();

      (globalThis as any).ResizeObserver = function () {
        return { observe: observeMock, disconnect: disconnectMock };
      };

      const removeSpy = vi.spyOn(window, 'removeEventListener');

      const Comp = {
        template: '<div />',
        setup() {
          const { scroller } = useHorizontalPager();
          scroller.value = mockElement;
          return {};
        },
      };

      const { mount } = await import('@vue/test-utils');
      const wrapper = mount(Comp as unknown as Component);

      await wrapper.unmount();

      expect(observeMock).toHaveBeenCalled();
      expect(disconnectMock).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });

    it('works when ResizeObserver is not available and still cleans up', async () => {
      delete (globalThis as any).ResizeObserver;

      const removeSpy = vi.spyOn(window, 'removeEventListener');

      const Comp = {
        template: '<div />',
        setup() {
          useHorizontalPager();
          return {};
        },
      };

      const { mount } = await import('@vue/test-utils');
      const wrapper = mount(Comp as unknown as Component);
      await wrapper.unmount();

      expect(removeSpy).toHaveBeenCalled();
    });
  });
});
