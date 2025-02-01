<template>
  <div class="flex flex-col">
    <Header />

    <UContainer class="prose md:prose-xl dark:prose-invert">
      <UCard
        :ui="{
          root: 'ring-0 shadow-none bg-transparent',
        }"
      >
        <slot />
        <template #footer> ddd </template>
      </UCard>
    </UContainer>
  </div>
</template>
