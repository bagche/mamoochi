<script lang="ts" setup>
const { profile } = useUser();
const { user } = useUserSession();
</script>

<template>
  <UContainer class="mt-5">
    <div class="flex max-w-7xl mx-auto gap-10">
      <h2>{{ user.displayName ?? profile.displayName }}</h2>
    </div>
  </UContainer>
</template>
