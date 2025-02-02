<script lang="ts" setup>
const { locale } = useI18n();

const route = useRoute();

const mdFile = computed(() =>
  route.path.startsWith("/fa/") || route.path.startsWith("/en")
    ? `%${route.path.slice(3) === "/" ? "index" : route.path.slice(4)}.${locale.value}`
    : `%${route.path === "/" ? "index" : route.path.slice(1)}.${locale.value}`
);

const { data: page }: any = await useAsyncData(route.path, () => {
  return (
    queryCollection("content")
      .where("path", "LIKE", mdFile.value)
      .first()
  );
});
useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
});
console.log(route.path, locale.value, mdFile.value);
</script>
<template>
  <div class="pt-5">
    <!-- <ContentDoc v-slot="{ doc }"> -->
    <!-- Intro section -->
    <!-- <PageIntro v-if="doc?.postIntro" /> -->

    <!-- Table of contents -->
    <!-- <p v-if="doc?.toc" class="text-xl font-semibold mb-4">
        {{ $t("contentToc") }}
      </p>
      <ol v-if="doc?.toc" class="text-base pb-4 list-decimal pl-6">
        <li v-for="link of doc?.body?.toc?.links" :key="link?.id" class="mb-2">
          <a :href="`#${link.id}`" class="text-blue-600 hover:underline">
            {{ link.text }}
          </a>
        </li>
      </ol> -->

    <!-- Main post content -->
    <!-- <ContentRenderer :value="doc" /> -->

    <!-- Comments section -->
    <!-- <Comments v-if="doc?.comments" /> -->
    <!-- </ContentDoc> -->
    <!-- <pre class="h-screen">{{ page.rawbody }}</pre> -->

    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>
