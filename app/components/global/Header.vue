<script lang="ts" setup></script>
<template>
  <header class="sticky w-full top-0 z-5 border-b bg-gray-100 border-gray-200">
    <UContainer class="flex gap-3 overflow-x-auto justify-start items-center">
      <LogoArea />
      <NavbarMenu />
      <div class="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <NavbarTools />
      </div>
    </UContainer>
  </header>
</template>
