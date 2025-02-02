<template>
  <div class="flex flex-col">
    <Header />
    <UContainer class="prose md:prose-xl dark:prose-invert md:w-7xl">
      <UCard
        :ui="{
          root: 'rounded-none ring-1 _shadow-none _bg-transparent',
          body: 'min-h-screen',
        }"
      >
        <slot />
        <template #footer> ddd </template>
      </UCard>
    </UContainer>
  </div>
</template>
