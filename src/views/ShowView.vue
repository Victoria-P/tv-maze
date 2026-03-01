<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { fetchShowById, fetchShowCast } from '@/api/tvmaze';
import { mapTvMazeCast, mapTvMazeShow } from '@/utils/show-util';
import { type CastMember, type Show } from '@/types/show.type';
import Breadcrumbs from '@/components/common/Breadcrumbs.vue';
import AppHeader from '@/components/AppHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import ShowDetails from '@/components/ShowDetails.vue';

const route = useRoute();
const id = computed(() => Number(route.params.id));

const error = ref<string | null>(null);
const isLoading = ref(false);
const show = ref<Show | null>(null);
const cast = ref<CastMember[]>([]);

const crumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: show.value?.name ?? (isLoading.value ? 'Loading…' : 'Show') },
]);

const fetchShowDetails = async (showId: number) => {
  error.value = null;
  isLoading.value = true;
  show.value = null;
  cast.value = [];

  try {
    const [rawShow, rawCast] = await Promise.all([fetchShowById(showId), fetchShowCast(showId)]);

    show.value = mapTvMazeShow(rawShow);
    cast.value = mapTvMazeCast(rawCast);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error';
  } finally {
    isLoading.value = false;
  }
};

watch(
  id,
  (newId) => {
    if (!Number.isFinite(newId) || newId <= 0) {
      error.value = 'Invalid show id';
      show.value = null;
      cast.value = [];
      isLoading.value = false;
      return;
    }
    fetchShowDetails(newId);
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <AppHeader />

    <main class="container">
      <Breadcrumbs :items="crumbs" />

      <div v-if="error" class="state-error p-14 rounded-lg">
        <div class="heading-md m-0 mb-8">Failed to load show</div>
        <div class="msg text-muted mb-14">{{ error }}</div>
        <hr class="w-full" />
        <BaseButton :to="'/'" variant="outline" class="mt-12">← Back to dashboard</BaseButton>
      </div>

      <div v-else-if="isLoading" class="state-loading text-muted">Loading…</div>

      <div v-else-if="show" class="grid-2col gap-18">
        <div class="img-container rounded-lg overflow-hidden border">
          <img
            v-if="show.image?.original || show.image?.medium"
            :src="show.image?.original || show.image?.medium"
            :alt="show.name"
            loading="lazy"
            decoding="async"
            class="w-full block"
          />
          <div v-else class="img-fallback p-40 text-center text-muted">No image</div>
        </div>

        <ShowDetails :show="show" :cast="cast" />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.grid-2col {
  display: grid;
  grid-template-columns: 280px 1fr;
  align-items: start;
  margin: 0 auto;
}

@media (max-width: 820px) {
  .grid-2col {
    grid-template-columns: 1fr;
  }
  .img-container {
    max-width: 420px;
    margin: 0 auto;
  }
}

.heading-md {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.2px;
}

.state-loading {
  padding: 10px 0;
}
</style>
