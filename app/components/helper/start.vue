<script setup lang="ts">
defineProps<{
  path?: string;
}>();
</script>

<template>
  <div>
    <UButton
      :to="'/manage/editor/' + path"
      label="sds"
      class="fixed left-10 bottom-10 shadow-md rounded-full cursor-pointer text-4xl z-100 p-3 transition-all dark:text-white text-black bg-gray-200 dark:bg-slate-700 border-gray-300 dark:border-slate-800"
    >
      <UIcon name="i-lucide-square-pen" />
    </UButton>
  </div>
</template>
