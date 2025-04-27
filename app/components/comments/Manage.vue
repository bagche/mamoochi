<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const props = defineProps({
  status: { type: String, required: true, default: "new" },
});

const { t } = useI18n();
const toast = useToast();

// Resolve Nuxt UI components
const UTable = resolveComponent("UTable");
const UButtonGroup = resolveComponent("UButtonGroup");
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UAvatar = resolveComponent("UAvatar");
const UPagination = resolveComponent("UPagination");

// Define the Comment type
type Comment = {
  id: number;
  routePath: string;
  body: string;
  status: string;
  createdAt: number;
  updatedAt?: number;
  authorId: number;
  authorUsername?: string;
  authorDisplayName?: string;
  authorAvatar?: string;
};

// Global submitting ref (could be per-row if needed)
const submitting = ref(false);

// Function to update the comment status via API call
async function updateCommentStatus(commentId: number, newStatus: string) {
  try {
    submitting.value = true;
    await $fetch("/api/comments/moderate", {
      method: "POST",
      body: JSON.stringify({ id: commentId, newStatus }),
    });
    toast.add({
      title: t("Success"),
      description: t("Comment status updated successfully"),
      color: "success",
    });
    // Refresh the table data after a successful update
    await refresh();
  } catch (error: any) {
    console.error(error);
    toast.add({
      title: t("Error"),
      description: error.statusMessage || t("Failed to update comment status"),
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
}

// Set up pagination state (UTable's v-model:pagination auto-updates this)
const pagination = ref({
  pageIndex: 0,
  pageSize: 20,
});

// Compute query parameters for useFetch (API expects a 1-indexed page number)
const queryParams = computed(() => ({
  page: pagination.value.pageIndex + 1,
  pageSize: pagination.value.pageSize,
  status: props.status,
}));

// Fetch paginated comments from the API endpoint
const {
  data,
  error,
  refresh,
  status: loading,
} = useFetch("/api/comments/all", {
  query: queryParams,
  server: true,
  default: () => ({ comments: [], total: 0 }),
});

// Define table columns for the comments table
const columns: TableColumn<Comment>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "routePath",
    header: t("Route"),
  },
  {
    id: "author",
    header: t("Author"),
    cell: ({ row }) => {
      const comment = row.original as Comment;
      const fullName =
        comment.authorDisplayName || comment.authorUsername || t("Unknown");
      return h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          src: comment.authorAvatar || "",
          size: "md",
          alt: fullName,
        }),
        h("div", null, () => [
          h("p", { class: "font-medium" }, fullName),
          h("p", null, `@${comment.authorUsername}`),
        ]),
      ]);
    },
  },
  {
    accessorKey: "body",
    header: t("Comment"),
    cell: ({ row }) => {
      const text = row.getValue("body");
      return text.length > 50 ? text.substring(0, 50) + "..." : text;
    },
  },
  {
    accessorKey: "status",
    header: t("Status"),
    cell: ({ row }) => {
      const status = row.getValue("status");
      let color = "neutral";
      let label = status;
      if (status === "published") {
        color = "success";
        label = t("Published");
      } else if (status === "spam") {
        color = "error";
        label = t("Spam");
      } else if (status === "new") {
        color = "neutral";
        label = t("New");
      }
      return h(UBadge, { color, size: "md" }, () => [label]);
    },
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
    id: "actions",
    header: t("Actions"),
    cell: ({ row }) => {
      const comment = row.original as Comment;
      const isPublished = comment.status === "published";
      const isSpam = comment.status === "spam";
      return h("div", { class: "text-right" }, [
        h(
          UButtonGroup,
          {
            size: "xs",
          },
          {
            default: () => [
              h(UButton, {
                color: "success",
                variant: isPublished ? "solid" : "subtle",
                label: t("Approve"),
                onClick: () => updateCommentStatus(comment.id, "published"),
              }),
              h(UButton, {
                color: "warning",
                variant: isSpam ? "solid" : "subtle",
                label: t("Spam"),
                onClick: () => updateCommentStatus(comment.id, "spam"),
              }),
              h(UButton, {
                color: "secondary",
                variant: "subtle",
                label: t("Edit"),
                onClick: () => {
                  console.log(edit);
                },
              }),
            ],
          }
        ),
      ]);
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
      :loading="loading === 'pending'"
      loading-color="primary"
      loading-animation="carousel"
      :data="data?.comments"
      :columns="columns"
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

    <!-- Display error message if fetching fails -->
    <div v-if="error" class="mt-4 text-red-500">
      {{ t("Failed to load comments") }}
    </div>
  </div>
</template>
