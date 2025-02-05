<script lang="ts" setup>
const { locale } = useI18n();

const route = useRoute();

const mdFile = computed(() =>
  route.path.startsWith("/fa/") || route.path.startsWith("/en")
    ? `%${route.path.slice(3) === "/" ? "index" : route.path.slice(4)}.${locale.value}`
    : `%${route.path === "/" ? "index" : route.path.slice(1)}.${locale.value}`
);

const { data: page }: any = await useAsyncData(route.path, () => {
  return queryCollection("content").where("path", "LIKE", mdFile.value).first();
});
useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
});
</script>
<template>
  <div v-if="page" class="pt-2">
    <ContentRenderer :value="page" />
    <HelperStart :path="page?.stem" />
  </div>
</template>
