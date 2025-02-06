<template>
  <div class="flex flex-col justify-start">
    <Header />
    <div class="min-h-screen">
      <slot />
    </div>

    <div
      class="w-full mx-auto p-4 text-center text-xl border-t border-gray-100 dark:border-slate-800"
    >
      footer
    </div>
  </div>
</template>
