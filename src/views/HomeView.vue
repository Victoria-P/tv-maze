<script setup lang="ts">
import { onMounted } from 'vue';
import { useShowsStore } from '@/stores/shows';
import AppHeader from '@/components/AppHeader.vue';
import SearchBar from '@/components/SearchBar.vue';
import SkeletonRow from '@/components/common/SkeletonRow.vue';
import HeroBanner from '@/components/HeroBanner.vue';
import ShowsList from '@/components/ShowsList.vue';

const showsStore = useShowsStore();

onMounted(() => {
  if (!showsStore.shows.length) {
    showsStore.init();
  }
});
</script>

<template>
  <AppHeader>
    <SearchBar v-model="showsStore.searchQuery" placeholder="Search TV shows by name…" />
  </AppHeader>

  <main class="container">
    <div class="shell">
      <HeroBanner v-if="showsStore.featuredShow" :show="showsStore.featuredShow" />

      <div v-if="showsStore.error" class="error">
        <div class="title">Something went wrong</div>
        <div class="msg">{{ showsStore.error }}</div>
      </div>

      <template v-else-if="showsStore.isLoading">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </template>

      <ShowsList v-else />
    </div>
  </main>
</template>
