<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { getPaginationRowModel } from "@tanstack/vue-table";

// Define page meta to use the "manage" layout

const { t } = useI18n();
// Resolve Nuxt UI components
const UTable = resolveComponent("UTable");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UAvatar = resolveComponent("UAvatar");
const UPagination = resolveComponent("UPagination");

// Define a User type (update fields as needed)
type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  avatar: string;
  about?: string;
};

// Define pagination state. Note: UTable's v-model:pagination will automatically update this.
const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
});

// Compute query parameters for useFetch (API expects 1-indexed page number)
const queryParams = computed(() => ({
  page: pagination.value.pageIndex + 1,
  pageSize: pagination.value.pageSize,
}));

// Use useFetch to retrieve paginated users from the API endpoint
// When queryParams change, useFetch will re-run the request.
const { data, error } = useFetch("/api/users/all", {
  query: queryParams,
});

// Toast for notifications
const toast = useToast();

// refs

const roleUserIsOpen = ref(false);
const currentUserId = ref(0);

// Define the table columns for the User table
const columns: TableColumn<User>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original as User;
      // Use displayName if available; otherwise, combine first and last names
      const fullName = user.displayName || `${user.firstName} ${user.lastName}`;
      return h("div", { class: "flex items-center gap-3" }, [
        // UAvatar with src set to the avatar URL
        h(UAvatar, {
          src: user.avatar,
          size: "lg",
          alt: fullName,
        }),
        h("div", null, [
          h(
            "p",
            { class: "font-medium text-(--ui-text-highlighted)" },
            fullName
          ),
          h("p", null, `@${user.username}`),
        ]),
      ]);
    },
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
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

// Define dropdown menu items for each user row
function getRowItems(row: Row<User>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: t("Manage Roles"),
      onSelect() {
        roleUserIsOpen.value = true;
        currentUserId.value = row.original.id;
      },
    },
    {
      label: "Edit User",
      onSelect() {
        toast.add({
          title: `Edit user #${row.original.id}`,
          color: "info",
          icon: "i-lucide-edit",
        });
      },
    },
    {
      label: "Delete User",
      onSelect() {
        toast.add({
          title: `Delete user #${row.original.id}`,
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
    <UTable
      v-model:pagination="pagination"
      :data="data?.users ?? []"
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
    <UsersAddRoleToUser
      v-model:is-open="roleUserIsOpen"
      :user-id="currentUserId"
    />
    <!-- Display an error message if the fetch fails -->
    <div v-if="error" class="mt-4 text-red-500">Failed to load users.</div>
  </div>
</template>
