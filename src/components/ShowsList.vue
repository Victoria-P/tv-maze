<script setup lang="ts">
import { useShowsStore } from '@/stores/shows';
import ShowCarousel from '@/components/ShowCarousel.vue';
import Card from '@/components/common/Card.vue';

const showsStore = useShowsStore();
</script>

<template>
  <div v-if="showsStore.genres.length === 0" class="text-center text-muted mt-18">
    No shows found.
  </div>

  <div
    v-else-if="showsStore.searchQuery.trim().length > 0"
    class="flex flex-wrap gap-14 justify-center mt-18"
  >
    <div class="item" v-for="show in showsStore.filtered" :key="show.id" role="listitem">
      <router-link class="link-unstyled" :to="`/shows/${show.id}`">
        <Card
          :name="show.name"
          :badgeLabel="show.rating"
          :img="show.image?.medium || show.image?.original || ''"
        />
      </router-link>
    </div>
  </div>

  <template v-else>
    <ShowCarousel
      v-for="genre in showsStore.genres"
      :key="genre"
      :title="genre"
      :shows="showsStore.groupedSorted[genre]!"
    />
  </template>
</template>
