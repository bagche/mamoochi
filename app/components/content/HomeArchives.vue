<script setup lang="ts">
const { data } = useAsyncData("home-archives", () => {
  return queryCollection("items").limit(10).all();
});
</script>

<template>
  <span>
    <h2 class="mt-0">{{ $t("Latest Incoming") }}</h2>

    <div v-if="data" class="px-5 md:m-0">
      <ol>
        <li v-for="item in data" :key="item.id" class="mb-2">
          <NuxtLink :to="item.path.slice(0, -3)" class="hover:underline">
            {{ item.title }}
          </NuxtLink>

          <span class="font-thin"> / {{ formatDateTime(item.date) }} </span>
          <span class="font-thin"> / {{ item.category }} </span>
        </li>
      </ol>
    </div>
    <p v-else>{{ $t("Noting is Here :(") }}</p>
  </span>
</template>
