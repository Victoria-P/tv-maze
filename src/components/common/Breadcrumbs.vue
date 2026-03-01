<script setup lang="ts">
type Crumb = { label: string; to?: string };

defineProps<{
  items: Crumb[];
}>();
</script>

<template>
  <nav class="bc" aria-label="Breadcrumb">
    <ol class="list">
      <li v-for="(c, i) in items" :key="i" class="item">
        <router-link v-if="c.to" class="link" :to="c.to">{{ c.label }}</router-link>
        <span v-else class="current" aria-current="page">{{ c.label }}</span>

        <span v-if="i < items.length - 1" class="sep" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped lang="scss">
.bc {
  margin: 10px 0 14px;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.link {
  color: var(--muted);
  font-weight: 700;
}

.link:hover {
  color: var(--text);
}

.current {
  font-weight: 800;
  color: var(--text);
}

.sep {
  color: var(--border-opacity-22);
}
</style>
