<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

// Newsletter type
type Newsletter = {
  id: number;
  email: string;
  createdAt: number;
};

const { t } = useI18n();
const pagination = ref({
  pageIndex: 0,
  pageSize: 20,
});

const queryParams = computed(() => ({
  page: pagination.value.pageIndex + 1,
  pageSize: pagination.value.pageSize,
}));

const { data, error, status } = useFetch("/api/newsletter/all", {
  query: queryParams,
});

// Table columns
const columns: TableColumn<Newsletter>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "email",
    header: t("Email"),
  },
  {
    accessorKey: "createdAt",
    header: t("Subscribed At"),
    cell: ({ row }) => {
      const ts = row.getValue("createdAt");
      return new Date(ts).toLocaleString();
    },
  },
];

const sorting = ref([
  {
    id: "createdAt",
    desc: true,
  },
]);
</script>

<template>
  <div class="w-full space-y-4 pt-4">
    <UTable
      v-model:sorting="sorting"
      :loading="status === 'pending'"
      loading-color="primary"
      loading-animation="carousel"
      :data="data?.subscriptions"
      :columns="columns"
      class="flex-1"
    />

    <div class="flex justify-center border-t border-(--ui-border) pt-4">
      <UPagination
        v-if="data?.total > pagination.pageSize"
        :default-page="pagination.pageIndex + 1"
        :items-per-page="pagination.pageSize"
        :total="data?.total ?? 0"
        @update:page="(p) => (pagination.pageIndex = p - 1)"
      />
    </div>

    <div v-if="error" class="mt-4 text-red-500">
      {{ t("Failed to load subscriptions") }}
    </div>
  </div>
</template>
