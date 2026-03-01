<script setup lang="ts">
import DOMPurify from 'dompurify';
import { computed } from 'vue';
import { type CastMember, type Show } from '@/types/show.type';
import Badge from '@/components/common/Badge.vue';
import AvatarCard from '@/components/common/AvatarCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const props = defineProps<{
  show: Show;
  cast: CastMember[];
}>();

const premieredLabel = computed(() => {
  if (!props.show?.premiered) return '';
  return new Intl.DateTimeFormat('en-GB').format(new Date(props.show.premiered));
});

const sanitizedSummary = computed(() =>
  DOMPurify.sanitize(props.show?.summaryHtml ?? '', { USE_PROFILES: { html: true } }),
);
</script>

<template>
  <div class="flex flex-col gap-12 show-details">
    <div class="flex-between">
      <h1 class="m-0">{{ show.name }}</h1>
      <Badge v-if="show.rating != null" :label="show.rating" />
    </div>

    <div class="flex flex-wrap gap-12 items-center text-muted">
      <span v-if="show.status">{{ show.status }}</span>
      <span v-if="show.language">{{ show.language }}</span>
      <span v-if="premieredLabel">Premiered {{ premieredLabel }}</span>
    </div>

    <div class="flex flex-wrap gap-8" v-if="show.genres?.length">
      <Badge v-for="genre in show.genres" :key="genre" :label="genre" />
    </div>

    <div class="text-summary" v-html="sanitizedSummary"></div>

    <section v-if="cast.length" class="cast-section">
      <h2 class="section-title m-0 mb-10">Cast</h2>

      <div class="grid-2col gap-10">
        <AvatarCard
          v-for="c in cast"
          :key="c.personId"
          :primaryText="c.personName"
          :secondaryText="`as ${c.characterName}`"
          :img="c.personImage"
        />
      </div>
    </section>

    <hr class="w-full" />
    <BaseButton :to="'/'" variant="outline">← Back to dashboard</BaseButton>
  </div>
</template>

<style scoped lang="scss">
.show-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 90vh;
}

.cast-section {
  margin-top: 18px;
  max-height: 40vh;
  overflow-y: auto;
  margin-left: -8px;
  padding-right: 8px;
}

.section-title {
  font-size: 16px;
  letter-spacing: 0.2px;
}

.grid-2col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 520px) {
  .grid-2col {
    grid-template-columns: 1fr;
  }
}
</style>
