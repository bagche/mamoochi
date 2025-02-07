<script setup lang="ts">
const { locale } = useI18n();
</script>
<template>
  <div class="flex text-3xl items-center text-center text-nowrap">
    <NuxtLink :to="'/' + locale + '/'" class="flex items-baseline">
      <span class="font-bold">
        {{ $t("titleFirst") + "" }}
      </span>
      <span class="font-thin">
        {{ $t("titleSecond") }}
      </span>
      <span class="font-thin text-xl mx-1">/</span>
      <span class="font-thin text-xl">
        {{ $t("description") }}
      </span>
    </NuxtLink>
  </div>
</template>
