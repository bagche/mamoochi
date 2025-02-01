<script setup lang="ts">
const { locale } = useI18n();
</script>
<template>
  <h1 class="flex text-3xl md:text-3xl items-center mx-5 text-center w-full">
    <NuxtLink :to="`/${locale}`" class="flex items-baseline">
      <span class="font-hairline">
        {{ $t("titleFirst") + "" }}
      </span>
      <span class="font-bold">
        {{ $t("titleSecond") }}
      </span>
      <span class="font-hairline text-xl mx-1">://</span>
      <span class="font-hairline text-xl">
        {{ $t("description") }}
      </span>
    </NuxtLink>
  </h1>
</template>
