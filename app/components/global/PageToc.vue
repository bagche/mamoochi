<script setup lang="ts">
defineProps({
  tocData: { type: Array, required: true, default: () => [] },
  comments: { type: Boolean, required: false, default: false },
});
</script>

<template>
  <div class="w-full mb-20">
    <h3 class="mt-0">
      {{ $t("Content Toc") }}
    </h3>
    <ol class="md:-mb-4 space-y-2">
      <li v-for="item in tocData" :key="item.url">
        <a :href="item.url" class="hover:underline">
          {{ item.title }}
        </a>

        <!-- Nested children -->
        <ul v-if="item.items?.length" class="ml-4 list-disc">
          <li v-for="sub in item.items" :key="sub.url">
            <a :href="sub.url" class="hover:underline">
              {{ sub.title }}
            </a>
          </li>
        </ul>
      </li>

      <li v-if="comments" key="comments">
        <a href="#comments" class="hover:underline">
          {{ $t("Comments") }}
        </a>
      </li>
    </ol>
  </div>
</template>
