<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

// i18n and toast
const { t } = useI18n();

// Resolve Nuxt UI components
const UTable = resolveComponent("UTable");
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UPagination = resolveComponent("UPagination");
const USeparator = resolveComponent("USeparator");

// Define types for Commit and Build
type Commit = {
  id: number;
  buildId: number;
  authorId: number;
  path: string;
  message: string;
  body: string;
  createdAt: number;
  updatedAt?: number;
};

type Build = {
  id: number;
  buildName: string;
  createdAt: number;
  status: "new" | "pending" | "success" | "failed";
  commits: Commit[];
};

// Server-side pagination state
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});

// Compute query parameters (server expects a 1-indexed page number)
const queryParams = computed(() => ({
  page: pagination.value.pageIndex + 1,
  pageSize: pagination.value.pageSize,
}));

// Fetch builds (with commits) from our API route
const { data, error, refresh, status } = useFetch("/api/builds/all", {
  query: queryParams,
});

// Define table columns for the builds table
const columns: TableColumn<Build>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "buildName",
    header: t("Build Name"),
  },
  {
    accessorKey: "createdAt",
    header: t("Created At"),
    cell: ({ row }) => {
      const timestamp = row.getValue("createdAt");
      return new Date(timestamp).toLocaleString();
    },
  },
  {
    accessorKey: "status",
    header: t("Status"),
    cell: ({ row }) => {
      const statusValue = row.getValue("status");
      let color: string;
      switch (statusValue) {
        case "new":
          color = "info";
          break;
        case "pending":
          color = "warning";
          break;
        case "success":
          color = "success";
          break;
        case "failed":
          color = "error";
          break;
        default:
          color = "neutral";
      }
      return h(UBadge, { color, size: "md" }, () => statusValue);
    },
  },
  {
    id: "action",
  },
];

// Sorting (for UI display only; server-side ordering is handled by the API)
const sorting = ref([
  {
    id: "createdAt",
    desc: true,
  },
]);
</script>

<template>
  <div class="w-full space-y-4 p-4">
    <USeparator icon="i-lucide-cpu" />

    <!-- Builds table with expandable rows for commits -->
    <UTable
      v-model:sorting="sorting"
      :loading="status === 'pending'"
      loading-color="primary"
      loading-animation="carousel"
      :data="data?.builds || []"
      :columns="columns"
      class="flex-1"
    >
      <template #expanded="{ row }">
        <div class="p-4 border-t ltr">
          <h3 class="font-bold mb-2">{{ t("Commits") }}</h3>
          <div v-if="row.original.commits && row.original.commits.length">
            <ul class="list-disc pl-5">
              <li v-for="commit in row.original.commits" :key="commit.id">
                <strong>{{ commit.message }}</strong>
                <br >
                <small>{{ new Date(commit.createdAt).toLocaleString() }}</small>
              </li>
            </ul>
          </div>
          <div v-else>
            {{ t("No commits found.") }}
          </div>
        </div>
      </template>

      <!-- Action slot renders the BuildsRun component if build status is "new" -->
      <template #action-cell="{ row }">
        <div v-if="row.original.status === 'new'">
          <BuildsRun :build-id="row.original.id" @finish="refresh" />
        </div>
      </template>
    </UTable>

    <!-- Pagination controls -->
    <div class="flex justify-center border-t border-(--ui-border) pt-4">
      <UPagination
        v-if="data?.total > pagination.pageSize"
        :default-page="pagination.pageIndex + 1"
        :items-per-page="pagination.pageSize"
        :total="data?.total || 0"
        @update:page="(p) => (pagination.pageIndex = p - 1)"
      />
    </div>

    <!-- Error message -->
    <div v-if="error" class="mt-4 text-red-500">
      {{ t("Failed to load builds") }}
    </div>
  </div>
</template>
