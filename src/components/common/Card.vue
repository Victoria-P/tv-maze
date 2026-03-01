<script setup lang="ts">
import Badge from '@/components/common/Badge.vue';

defineProps<{ name: string; badgeLabel?: string; img?: string }>();
</script>

<template>
  <div class="card-wrapper" :aria-label="name">
    <div class="card">
      <img v-if="img" class="poster" :src="img" :alt="name" loading="lazy" decoding="async" />
      <div v-else class="fallback">No image</div>

      <Badge v-if="badgeLabel" class="badge" :label="badgeLabel" />
    </div>

    <div class="name" :title="name">{{ name }}</div>
  </div>
</template>

<style scoped lang="scss">
.card-wrapper {
  width: 160px;
}

.card {
  position: relative;
  width: 160px;
  height: 220px;
  border-radius: var(--r-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--surface-opacity-6);
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.16s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.badge {
  position: absolute;
  left: 10px;
  bottom: 10px;
}

.name {
  margin-top: 10px;
  font-weight: 900;
  font-size: 13px;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;

  overflow: hidden;
  line-height: 1.2;
  max-height: calc(13px * 1.2 * 2);
}
</style>
