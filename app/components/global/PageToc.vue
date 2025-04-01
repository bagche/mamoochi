<script setup lang="ts">
defineProps({
  body: { type: Object, required: true, default: {} },
});
</script>
<template>
  <div class="w-full">
    <h3 class="text-2xl sm:text-3xl font-bold mt-0">
      {{ $t("Content Toc") }}
    </h3>
    <ol class="text-md md:-mb-4">
      <li v-for="link of body.toc.links" :key="link.id">
        <a :href="`#${link.id}`">{{ link.text }}</a>
        <ul>
          <li v-for="link1 of link.children" :key="link1.id">
            <a :href="`#${link1.id}`">{{ link1.text }}</a>
          </li>
        </ul>
      </li>
    </ol>
  </div>
</template>
