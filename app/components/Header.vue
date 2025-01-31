<script lang="ts" setup></script>
<template>
  <header
    class="sticky w-full top-0 bg-gray-100 dark:bg-slate-900 dark:border-slate-100"
  >
    <div
      class="flex flex-col md:flex-row container justify-between md:items-center py-4 gap-4 md:gap-0 mx-auto"
    >
      <div class="flex items-center md:justify-start">
        <Navbar />
        <!-- <MainMenu class="text-md hidden md:text-sm md:flex" /> -->
      </div>
      <div
        class="flex gap-2 text-md items-center justify-between md:justify-end"
      >
        <!-- <Stories class="mx- -my-10" /> -->
        <div class="flex gap-2 mx-5">
          <DarkMode class="" />
        </div>
      </div>
    </div>
  </header>
</template>
