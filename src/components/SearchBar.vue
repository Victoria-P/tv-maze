<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
}>();

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="wrap">
    <input
      class="input"
      :value="modelValue"
      :placeholder="placeholder ?? 'Search shows…'"
      @input="handleSearch"
    />
  </div>
</template>

<style scoped lang="scss">
.wrap {
  display: flex;
  gap: 10px;
  width: min(520px, 100%);
}

.input {
  flex: 1;
  height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface-opacity-6);
  color: var(--text);
  outline: none;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.input:focus {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border-opacity-12));
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.btn {
  height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  font-weight: 900;
  cursor: pointer;
}

.btn:hover {
  background: var(--surface-opacity-12);
}
</style>
