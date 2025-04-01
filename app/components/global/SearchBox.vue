<script setup lang="ts">
import MiniSearch from "minisearch";

// Get current locale and translation function
const { locale, t } = useI18n();

// Modal state
const open = ref(false);
defineShortcuts({
  meta_k: () => {
    open.value = !open.value;
  },
});

// Search term (bound to our external input)
const searchTerm = ref("");

// Fetch data from Nuxt Content, filtering by path for the current locale.
const { data }: any = await useAsyncData("searchData", async () =>
  queryCollectionSearchSections("content")
);

// Initialize MiniSearch
const miniSearch = new MiniSearch({
  fields: ["title", "content"],
  storeFields: ["title", "content", "id"],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
  },
});

// Watch for changes in data and update MiniSearch index
watchEffect(() => {
  if (data.value) {
    miniSearch.removeAll(); // Clear previous data before adding new
    miniSearch.addAll(data.value);
  }
});

// Default items: only include items with no "logs" and no hash (i.e., regular pages)
const defaultItems = computed(() => {
  return data.value.filter(
    (item: any) => item.id.includes(locale.value) && !item.id.includes("#")
  );
});

// Helper function to return the correct icon and label based on the URL
function getIconAndLabel(url: string): { icon: string; label: string } {
  if (url.includes("logs")) {
    if (url.includes("#")) {
      return { icon: "i-lucide-hash", label: t("Note Section") };
    }
    return { icon: "i-lucide-notepad-text", label: t("logs") };
  }
  if (url.includes("#")) {
    return { icon: "i-lucide-book-open-check", label: t("Pages Section") };
  }
  return { icon: "i-lucide-book-open", label: t("Page") };
}

// Computed property for search results.
// If no search term is provided, display default items. Otherwise, perform a MiniSearch.
const results = computed(() => {
  if (!searchTerm.value) {
    return defaultItems.value.map((item: any) => ({
      label: item.title,
      description: item.content ? item.content.slice(0, 100) + "..." : "",
      to: item.id,
    }));
  } else {
    const searchResults = miniSearch.search(searchTerm.value).slice(0, 20);
    console.log("results", searchResults);
    return searchResults.map((r: any) => ({
      label: r.title,
      description: r.content ? r.content.slice(0, 100) + "..." : "",
      to: r.id,
    }));
  }
});

// When a result is clicked, clear the search and close the modal.
function onSelect() {
  searchTerm.value = "";
  open.value = false;
}
</script>

<template>
  <UModal v-model:open="open">
    <UTooltip :text="$t('Search')">
      <UButton
        icon="i-lucide-search"
        variant="ghost"
        size="xs"
        @click="open = true"
      />
    </UTooltip>

    <template #content>
      <div class="p-4 overflow-x-auto h-full">
        <!-- Search input -->
        <UInput
          v-model="searchTerm"
          icon="i-lucide-search"
          :placeholder="$t('Type to Search...')"
          class="mb-4 w-full"
        />
        <USeparator />
        <!-- Search results list -->
        <ul class="mt-3">
          <li
            v-for="item in results"
            :key="item.to"
            class="flex items-center border-b last:border-none"
          >
            <NuxtLink
              :to="item.to"
              class="flex items-center py-3"
              @click="onSelect"
            >
              <UIcon
                :name="getIconAndLabel(item.to).icon"
                class="size-6 mx-2"
              />
              <div>
                <div class="flex items-center">
                  <span class="font-d">{{ item.label }}</span>
                  <span class="mx-1 font-d">/</span>
                  <span class="font-thin">
                    {{ getIconAndLabel(item.to).label }}
                  </span>
                </div>
                <div class="text-xs">{{ item.description }}</div>
              </div>
            </NuxtLink>
          </li>
          <!-- Optionally, show a message if no results are found -->
          <li v-if="results.length === 0" class="text-center py-4">
            {{ $t("No results found") }}
          </li>
        </ul>
      </div>
    </template>
  </UModal>
</template>
