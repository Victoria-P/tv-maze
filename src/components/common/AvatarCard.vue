<script setup lang="ts">
const props = defineProps<{ primaryText: string; secondaryText?: string; img?: string }>();
</script>

<template>
  <div class="avatar-card">
    <div class="avatar">
      <img v-if="img" :src="img" :alt="primaryText" loading="lazy" />
      <div v-else class="avatar-fallback">👤</div>
    </div>

    <div>
      <div class="primary-text">{{ primaryText }}</div>
      <div class="secondary-text">{{ secondaryText }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar-card {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(18, 22, 37, 0.7);
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--border-opacity-12);
  background: rgba(0, 0, 0, 0.35);
  flex: 0 0 auto;
  display: grid;
  place-items: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-fallback {
  color: rgba(231, 233, 238, 0.75);
  font-size: 16px;
}

.primary-text {
  font-weight: 800;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.secondary-text {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
