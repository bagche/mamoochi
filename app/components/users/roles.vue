<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";

// Define page meta to use the "manage" layout
definePageMeta({
  layout: "manage",
});

// Resolve Nuxt UI components
const UTable = resolveComponent("UTable");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

// Define a Role type matching your schema
type Role = {
  id: number;
  name: string;
  description: string;
};

// Reactive pagination state (UTable uses a 0-indexed pageIndex)
const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
});

// Compute query parameters for useFetch (API expects 1-indexed page)
const queryParams = computed(() => ({
  page: pagination.value.pageIndex + 1,
  pageSize: pagination.value.pageSize,
}));

// Fetch paginated roles from the API endpoint.
// When queryParams change, useFetch re-runs automatically.
const { data, error } = useFetch("/api/roles/all", {
  query: queryParams,
});

// Get toast composable for notifications
const toast = useToast();

// Define the table columns for the Roles table
const columns: TableColumn<Role>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: { align: "end" },
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
            })
        )
      );
    },
  },
];

// Define dropdown menu items for each role row
function getRowItems(row: Row<Role>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Edit Role",
      onSelect() {
        toast.add({
          title: `Edit role #${row.original.id}`,
          color: "info",
          icon: "i-lucide-edit",
        });
      },
    },
    {
      label: "Delete Role",
      onSelect() {
        toast.add({
          title: `Delete role #${row.original.id}`,
          color: "error",
          icon: "i-lucide-trash",
        });
      },
    },
  ];
}
</script>

<template>
  <div class="w-full space-y-4 p-4">
    <USeparator icon="i-heroicons-key" />
    <UTable :data="data?.roles ?? []" :columns="columns" class="flex-1" />

    <!-- Display error if the fetch fails -->
    <div v-if="error" class="mt-4 text-red-500">Failed to load roles.</div>
  </div>
</template>
