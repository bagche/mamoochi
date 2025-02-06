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
  <div v-if="page" class="pt-10">
    <div class="text-center max-w-8xl flex-col gap-3 flex">
      <h1 class="text-5xl pb-5">{{ page.title }}</h1>
      <p class="bg-gray-200 p-4 text-lg max-w-7xl mx-auto dark:bg-slate-800">
        {{ page.description }}
      </p>
    </div>
    <nuxt-img
      preload
      loading="lazy"
      sizes="sm:100vw md:400vw lg:1200px"
      class="w-full bg-gray-200 mt-10"
      :src="page?.thumbnail"
      :alt="page?.title"
      :placeholder="[800]"
    />
    <UContainer>
      <div class="flex max-w-7xl mx-auto gap-10">
        <ContentRenderer
          :value="page"
          class="prose prose-xl dark:prose-invert mt-10"
        />
        <div class="w-[50rem] bg-gray-100 p-10 text-xl dark:bg-slate-800">
          tools
        </div>
      </div>
    </UContainer>
    <HelperStart :path="page?.stem" />
  </div>
</template>
