<template>
  <div>
    <UButton
      variant="ghost"
      size="xs"
      class="flex dark:hidden cursor-pointer"
      icon="i-heroicons-moon"
      @click="$colorMode.preference = 'dark'"
    />
    <UButton
      variant="ghost"
      size="xs"
      icon="i-heroicons-sun"
      class="hidden dark:flex cursor-pointer"
      @click="$colorMode.preference = 'light'"
    />
  </div>
</template>
