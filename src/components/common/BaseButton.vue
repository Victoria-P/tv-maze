<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw;
    href?: string;
    variant?: Variant;
    size?: Size;
    icon?: boolean;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    icon: false,
    type: 'button',
    disabled: false,
  },
);

const attrs = useAttrs();

const isLink = computed(() => !!props.to || !!props.href);

const component = computed(() => {
  if (props.to) return 'router-link';
  if (props.href) return 'a';
  return 'button';
});

/**
 * When disabled:
 * - buttons use native disabled
 * - links become inert (no navigation), and get aria-disabled
 */
const effectiveTo = computed(() => (props.disabled ? undefined : props.to));
const effectiveHref = computed(() => (props.disabled ? undefined : props.href));

function onClick(e: MouseEvent) {
  if (!props.disabled) return;
  e.preventDefault();
  e.stopPropagation();
}
</script>

<template>
  <component
    :is="component"
    v-bind="attrs"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--icon': icon, 'is-disabled': disabled }]"
    :to="effectiveTo"
    :href="effectiveHref"
    :type="component === 'button' ? type : undefined"
    :disabled="component === 'button' ? disabled : undefined"
    :aria-disabled="isLink && disabled ? 'true' : undefined"
    :tabindex="isLink && disabled ? -1 : (attrs as Record<string, unknown>).tabindex"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
.btn {
  color: var(--text);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
  user-select: none;

  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.14);
}

/* Disabled */
.is-disabled {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
}

/* Sizes */
.btn--sm {
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
}

.btn--md {
  height: 44px;
  padding: 0 18px;
  font-size: 14px;
}

.btn--lg {
  height: 52px;
  padding: 0 24px;
  font-size: 16px;
}

/* Icon button mode */
.btn--icon {
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 999px;
  font-size: 18px;
  line-height: 1;
}

/* Variants */
.btn--primary {
  background: var(--accent-soft);
  border: 1px solid var(--border-opacity-18);
}

.btn--primary:hover {
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.btn--outline {
  background: var(--surface-opacity-6);
  border: 1px solid var(--border-opacity-22);
}

.btn--outline:hover {
  background: var(--surface-opacity-12);
}

.btn--ghost {
  background: var(--surface-opacity-6);
  border: 1px solid var(--border-opacity-12);
}

.btn--ghost:hover {
  background: var(--surface-opacity-12);
}
</style>
