<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { getPaginationRowModel } from "@tanstack/vue-table";

// Define page meta to use the "manage" layout
definePageMeta({
  layout: "manage",
});

// Resolve Nuxt UI components
const UTable = resolveComponent("UTable");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UPagination = resolveComponent("UPagination");

// Define an Edit type matching your schema
type Edit = {
  id: number;
  createdAt: number;
  updatedAt?: number;
  author: number;
  path: string;
  type: string;
  status: string;
  body: string;
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

// Fetch paginated edits from the API endpoint.
const { data, error } = useFetch("/api/editor/new", {
  query: queryParams,
  immediate: false,
});

// Get toast composable for notifications
const toast = useToast();

// Define the table columns for the Edits table
const columns: TableColumn<Edit>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "path",
    header: "Path",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const updated = row.getValue("updatedAt");
      return updated ? new Date(updated).toLocaleString() : "Never";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "body",
    header: "Content",
    cell: ({ row }) => {
      const text = row.getValue("body") as string;
      return text.length > 100 ? text.slice(0, 100) + "..." : text;
    },
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

// Define dropdown menu items for each edit row
function getRowItems(row: Row<Edit>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Edit",
      onSelect() {
        toast.add({
          title: `Edit record #${row.original.id}`,
          color: "info",
          icon: "i-lucide-edit",
        });
      },
    },
    {
      label: "Delete",
      onSelect() {
        toast.add({
          title: `Delete record #${row.original.id}`,
          color: "error",
          icon: "i-lucide-trash",
        });
      },
    },
  ];
}
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <!-- Table component with pagination -->
    <UTable
      v-model:pagination="pagination"
      :data="data?.edits ?? []"
      :columns="columns"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      class="flex-1"
    />

    <!-- Pagination controls -->
    <div class="flex justify-center border-t border-(--ui-border) pt-4">
      <UPagination
        v-if="data?.total > pagination.pageSize"
        :default-page="pagination.pageIndex + 1"
        :items-per-page="pagination.pageSize"
        :total="data?.total ?? 0"
        @update:page="(p) => (pagination.pageIndex = p - 1)"
      />
    </div>

    <!-- Display error if the fetch fails -->
    <div v-if="error" class="mt-4 text-red-500">Failed to load edits.</div>
  </div>
</template>
