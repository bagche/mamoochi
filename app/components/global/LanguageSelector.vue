<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n();

const availableLocales = computed(() =>
  locales.value.filter((l) => l.code !== locale.value)
);
</script>

<template>
  <div class="flex items-center pt-1">
    <UButton
      v-for="loc in availableLocales"
      :key="loc.code"
      class="cursor-pointer"
      size="xs"
      variant="ghost"
      external
      @click="setLocale(loc.code)"
    >
      {{ loc.code !== "fa" ? t("English") : t("Persian") }}
    </UButton>
  </div>
</template>
