<script setup lang="ts">
const items = [
  {
    label: "Account",
    description:
      "Make changes to your account here. Click save when you're done.",
    icon: "i-lucide-user",
    slot: "account",
  },
  {
    label: "Password",
    description:
      "Change your password here. After saving, you'll be logged out.",
    icon: "i-lucide-lock",
    slot: "password",
  },
];

 
</script>

<template>
  <UTabs
    :items="items"
    variant="link"
    class="gap-4 w-full"
    :ui="{ trigger: 'flex-1' }"
  >
    <template #account="{ item }">
      <p class="text-(--ui-text-muted) mb-4">
        {{ item.description }}
      </p>
    </template>

    <template #password="{ item }">
      <p class="text-(--ui-text-muted) mb-4">
        {{ item.description }}
      </p>
    </template>
  </UTabs>
</template>
