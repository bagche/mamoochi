<script setup lang="ts">
const { locale, locales } = useI18n();
const { setLocale } = useI18n();

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});
</script>

<template>
  <div class="items-center flex pt-1">
    <UButton
      v-for="loc in availableLocales"
      :key="loc.code"
      class="cursor-pointer"
      size="xs"
      variant="ghost"
      :external="true"
      @click="setLocale(loc.code)"
    >
      {{ loc.code !== "fa" ? $t("English") : $t("Persian") }}
    </UButton>
  </div>
</template>
