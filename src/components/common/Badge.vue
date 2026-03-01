<script setup lang="ts">
const props = defineProps<{ label: string }>();
</script>

<template>
  <div class="badge">
    {{ label }}
  </div>
</template>

<style scoped lang="scss">
.badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid var(--border-opacity-12);
  font-weight: 400;
  font-size: 12px;
}
</style>
