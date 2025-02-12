<script setup lang="ts">
definePageMeta({
  layout: "manage",
});
</script>

<template>
  <div class="flex flex-col">
    <div class="flex w-full h-60">
      <div class="basis-1/2"><ChartsSimple /></div>
      <div class="basis-1/2"><ChartsSimple /></div>
    </div>
    <div class="min-h-40">body</div>
  </div>
</template>
