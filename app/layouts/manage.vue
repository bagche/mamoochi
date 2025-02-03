<template>
  <div class="flex flex-col">
    <Header />
    <UContainer class="flex gap-3 mt-3 md:w-7xl">
      <ManageSideBar />
      <div class="w-full bg-gray-200">
        <UCard
          :ui="{
            root: 'rounded-none ring-1 _shadow-none _bg-transparent',
            body: 'min-h-[50rem]',
          }"
        >
          <slot />
          <template #footer> ddd </template>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
