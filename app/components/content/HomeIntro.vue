<script setup lang="ts">
const { data } = useAsyncData("home-intro", () => {
  return queryCollection("items").first();
});
</script>
<template>
  <div>
    <div
      class="flex flex-col-reverse md:flex-row justify-between items-center h-screen-md"
    >
      <div class="basis-2/2 md:basis-1/2 flex-col justify-start items-center">
        <div class="items-center flex gap-3">
          <h2 class="">
            <NuxtLink :external="false" :to="data?.path?.slice(0, -3)" class="">
              {{ data?.title }}
            </NuxtLink>
          </h2>
        </div>

        <p>
          {{ data?.description }}
        </p>
        <NuxtLink
          :external="false"
          :to="data?.path?.slice(0, -3)"
          class="mx-4 hover:underline"
        >
          {{ $t("more") }}...
        </NuxtLink>
      </div>
      <div class="w-full md:basis-1/2 flex justify-end items-center">
        <nuxt-img
          preload
          loading="lazy"
          sizes="sm:100vw md:50vw lg:500px"
          class="flex w-full md:max-w-[25rem]"
          :src="data?.thumbnail"
          :alt="data?.title"
          :placeholder="[400]"
        />
      </div>
    </div>
  </div>
</template>
