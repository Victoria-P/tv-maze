import { onBeforeUnmount, onMounted, ref } from 'vue';

type Options = {
  onUpdate?: (page: number, totalPages: number) => void;
};

export function useHorizontalPager(options: Options = {}) {
  const scroller = ref<HTMLElement | null>(null);

  const page = ref(1);
  const totalPages = ref(1);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const updateMetrics = () => {
    const el = scroller.value;
    if (!el) return;

    const width = el.clientWidth;
    const scrollWidth = el.scrollWidth;

    if (width <= 0 || scrollWidth <= width) {
      totalPages.value = 1;
      page.value = 1;
      options.onUpdate?.(page.value, totalPages.value);
      return;
    }

    const maxScroll = scrollWidth - width;
    const pages = Math.max(1, Math.ceil(maxScroll / width) + 1);

    totalPages.value = pages;

    const current = Math.round(el.scrollLeft / width) + 1;
    page.value = clamp(current, 1, pages);

    options.onUpdate?.(page.value, totalPages.value);
  };

  let raf = 0;
  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateMetrics);
  };

  const scrollByPage = (dir: -1 | 1) => {
    const el = scroller.value;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  const resetToStart = () => {
    const el = scroller.value;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: 'auto' });
    page.value = 1;
    requestAnimationFrame(updateMetrics);
  };

  let ro: ResizeObserver | null = null;
  const onWindowResize = () => updateMetrics();

  onMounted(() => {
    requestAnimationFrame(updateMetrics);

    const el = scroller.value;

    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => updateMetrics());
      if (el) ro.observe(el);
    }
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    ro?.disconnect();
    window.removeEventListener('resize', onWindowResize);
  });

  return {
    scroller,
    page,
    totalPages,
    updateMetrics,
    onScroll,
    scrollByPage,
    resetToStart,
  };
}
