<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n();
const availableLocales = computed(() =>
  locales.value.filter((l) => l.code !== locale.value)
);

const switchLocale = async (code: string) => {
  await setLocale(code);
  await reloadNuxtApp();
};
</script>

<template>
  <div class="flex items-center pt-1">
    <UButton
      v-for="loc in availableLocales"
      :key="loc.code"
      class="cursor-pointer"
      size="xs"
      variant="link"
      @click="switchLocale(loc.code)"
    >
      {{ loc.name }}
    </UButton>
  </div>
</template>
