<template>
  <div class="flex flex-col">
    <slot name="app-before" />
    <div id="app-before" />
    <Header />

    <main class="flex min-h-screen">
      <div class="mx-auto">
        <div class="prose md:prose-xl dark:prose-invert">
          <UCard
            :ui="{
              root: 'ring-0 shadow-none bg-transparent',
            }"
          >
            <slot />
            <!-- Footer Slot -->
            <template #footer>
              ddd
            </template>
          </UCard>
        </div>
      </div>

      <slot name="app-after" />
      <div id="app-after" />
    </main>

  </div>
</template>
