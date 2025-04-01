<script lang="ts" setup></script>
<template>
  <header
    :class="
      $colorMode.value === 'dark'
        ? 'bg-slate-800 border-slate-900'
        : 'bg-gray-100  border-gray-200'
    "
    class="sticky w-full top-0 z-5 border-b"
  >
    <UContainer class="flex gap-4 overflow-x-auto justify-start">
      <LogoArea />
      <NavbarMenu />
      <NavbarTools />
    </UContainer>
  </header>
</template>
