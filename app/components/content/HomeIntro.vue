<script setup lang="ts">
import { NodeViewWrapper } from "@tiptap/vue-3";
const items = [
  "https://picsum.photos/640/640?random=1",
  "https://picsum.photos/640/640?random=2",
  "https://picsum.photos/640/640?random=3",
  "https://picsum.photos/640/640?random=4",
  "https://picsum.photos/640/640?random=5",
  "https://picsum.photos/640/640?random=6",
];
</script>

<template>
  <node-view-wrapper >
    <UCarousel
      v-slot="{ item }"
      dots
      :items="items"
      :ui="{ item: 'basis-1/3' }"
    >
      <img :src="item" width="320" height="320" class="rounded-lg" >
    </UCarousel>
  </node-view-wrapper>
</template>
