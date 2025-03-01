<script lang="ts" setup>
const route = useRoute();

// Fetch page content dynamically
const { data: pageData } = await useAsyncData(
  `page:${route.path}`,
  async () => {
    try {
      return await queryCollection("content").path(route.path).first();
    } catch (error) {
      console.error("Error fetching page content:", error);
      return null;
    }
  },
  { default: () => null, lazy: true, cache: "max-age=3600" } // Cache for 1 hour
);

// Set dynamic page metadata (SEO)
useSeoMeta({
  title: pageData.value?.title,
  description: pageData.value?.description,
});
</script>

<template>
  <div class="w-full min-h-screen">
    <!-- Show content if available -->
    <div v-if="pageData" class="w-full">
      <!-- Notes Section -->
      <template v-if="pageData.thumbnail">
        <div
          class="flex flex-col gap-5 text-center pt-15 pb-10 border-b border-gray-200 dark:border-slate-700 dark:bg-slate-600 bg-gray-100 min-h-[calc(100vh-2rem)] items-center justify-around"
        >
          <div class="max-w-7xl mx-auto">
            <h1
              class="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4"
            >
              {{ pageData.title }}
            </h1>
            <div
              class="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-300"
            >
              <span
                v-if="pageData?.author"
                class="font-medium whitespace-nowrap"
              >
                {{ $t("Author: ")
                }}<span class="normal-case">{{ pageData.author }}</span>
              </span>
              <span
                v-if="pageData?.category"
                class="font-medium whitespace-nowrap"
              >
                {{ $t("Category: ")
                }}<span class="normal-case">{{
                  $t(pageData?.category) ?? pageData?.category
                }}</span>
              </span>
              <span v-if="pageData?.date" class="font-medium whitespace-nowrap">
                {{ $t("Date: ")
                }}<span class="normal-case">{{
                  formatDateTime(pageData.date)
                }}</span>
              </span>
            </div>
            <p class="mt-4 text-xl text-gray-600 dark:text-gray-300">
              {{ pageData.description }}
            </p>
          </div>
          <nuxt-img
            v-if="pageData.thumbnail"
            preload
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 700px"
            class="object-cove h-[calc(100vh-24rem)] max-w-7xl rounded-lg"
            :src="pageData.thumbnail"
            :alt="pageData.title"
            :placeholder="[600]"
          />
        </div>
      </template>
      <!-- Main Content -->
      <UContainer>
        <div class="max-w-7xl mx-auto flex flex-col items-center pt-10">
          <ContentRenderer
            :value="pageData"
            class="prose prose-lg dark:prose-invert w-full max-w-4xl"
          />
        </div>
      </UContainer>

      <!-- Edit Button (If User Has Permission) -->
      <Can :ability="editPage">
        <HelperStart v-if="pageData && pageData.stem" :path="pageData.stem" />
      </Can>
    </div>

    <!-- Loading Skeleton -->
    <div
      v-else
      class="flex flex-col gap-5 text-center pt-15 pb-10 border-b border-gray-200 dark:border-slate-700 dark:bg-slate-600 bg-gray-100 min-h-[calc(100vh-2rem)] items-center justify-around"
    >
      <div class="max-w-7xl mx-auto w-full">
        <!-- Title -->
        <div
          class="h-12 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mx-auto animate-pulse"
        ></div>
        <!-- Metadata -->
        <div class="flex justify-center gap-4 mt-4">
          <div
            class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 animate-pulse"
          ></div>
          <div
            class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 animate-pulse"
          ></div>
          <div
            class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 animate-pulse"
          ></div>
        </div>
        <!-- Description (Multi-line) -->
        <div class="mt-4 space-y-2">
          <div
            class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-full animate-pulse"
          ></div>
          <div
            class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-full animate-pulse"
          ></div>
          <div
            class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"
          ></div>
        </div>
      </div>
      <!-- Image -->
      <div
        class="h-[calc(100vh-24rem)] max-w-7xl bg-gray-200 dark:bg-slate-700 rounded-lg mx-auto animate-pulse"
      ></div>
    </div>
  </div>
</template>
