<script setup lang="ts">
import Fuse from "fuse.js";

// Get current locale and translation function
const { locale, t } = useI18n();
const route = useRoute();

// Modal state
const open = ref(false);
defineShortcuts({
  meta_k: () => {
    open.value = !open.value;
  },
});

// Command palette search term
const searchTerm = ref("");

// Fetch data from Nuxt Content, filtering by path for the current locale.
// Notice we include locale.value in the key so the data is refreshed when the locale changes.
const { data } = await useAsyncData(
  `searchData:${locale.value}:${route.path}`,
  async () =>
    await queryCollectionSearchSections("content").where(
      "path",
      "LIKE",
      `/${locale.value}/%`
    )
);

// Default items: only include items with no "notes" and no hash (i.e. regular pages)
const defaultItems = computed(() => {
  return data.value.filter(
    (item) => !item.id.includes("notes") && !item.id.includes("#")
  );
});

// Helper function to return the correct icon and label based on the URL
function getIconAndLabel(url: string): { icon: string; label: string } {
  if (url.includes("notes")) {
    if (url.includes("#")) {
      return { icon: "i-lucide-hash", label: t("Note Section") };
    }
    return { icon: "i-lucide-notepad-text", label: t("Notes") };
  }
  if (url.includes("#")) {
    return { icon: "i-lucide-book-open-check", label: t("Pages Section") };
  }
  return { icon: "i-lucide-book-open", label: t("Page") };
}

// Compute search groups
const groups = computed(() => {
  if (!searchTerm.value) {
    return [
      {
        id: "results",
        items: defaultItems.value.map((item) => ({
          label: item.title,
          description: item.content ? item.content.slice(0, 100) + "..." : "",
          to: item.id,
        })),
      },
    ];
  }
  // Use Fuse to search within the full data when there is a search term
  const fuse = new Fuse(data.value, {
    keys: ["title", "description"],
  });
  const result = fuse.search(searchTerm.value).slice(0, 20);
  return [
    {
      id: "results",
      items: result.map((r) => ({
        label: r.item.title,
        description: r.item.content ? r.item.content.slice(0, 100) + "..." : "",
        to: r.item.id,
      })),
    },
  ];
});

// Clear the search term when an item is selected.
function onSelect() {
  searchTerm.value = "";
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content: 'min-h-100',
    }"
  >
    <UTooltip :text="$t('Search')">
      <UButton
        icon="i-lucide-search"
        variant="ghost"
        size="xs"
        @click="open = true"
      />
    </UTooltip>

    <template #content>
      <!-- UCommandPalette handles both the search input and displaying results -->
      <UCommandPalette
        v-model:search-term="searchTerm"
        :groups="groups"
        class="flex-1 h-80"
        :placeholder="$t('Type to Search...')"
        @update:model-value="onSelect"
      >
        <!-- Custom slot for rendering each search result -->
        <template #item-label="{ item }: any">
          <div class="flex items-center">
            <div class="mx-2">
              <UIcon :name="getIconAndLabel(item.to).icon" class="size-5" />
            </div>
            <div>
              <div>
                <span class="font-d">{{ item.label }}</span>
                <span class="mx-1 font-d">/</span>
                <span class="font-thin">
                  {{ getIconAndLabel(item.to).label }}
                </span>
              </div>
              <div class="text-gray-500 text-xs">{{ item.description }}</div>
            </div>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>
