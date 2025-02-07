<template>
  <div class="flex flex-col">
    <Header />
    <UContainer class="flex gap-3 md:w-7xl">
      <!-- <ManageSideBar /> -->
      <div class="w-full">
        <UCard
          :ui="{
            root: 'rounded-sm ring-1 mt-2 dark:bg-slate-800 bg-gray-50',
            body: 'min-h-[60rem]',
          }"
        >
          <slot />
          <template #footer> ddd </template>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
