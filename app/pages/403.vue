<template>
  <div class=" flex items-center h-[calc(100vh-7rem)]   ">
    <UContainer class="flex flex-col items-center max-w-7xl mx-auto gap-6 text-center ">
      <UIcon name="i-lucide-shield-off" class="text-red-500 size-40"  />
      <h2 class="text-3xl font-semibold">{{ $t('Permission Denied') }}</h2>
      <p class="text-lg">{{ $t('You do not have the necessary permissions to access this page.') }}</p>
      <p class="text-lg">{{ $t('If you believe this is an error, please contact the administrator.') }}</p>
      <RouterLink to="/" class="mt-4 text-blue-500 hover:underline">
        {{ $t('Return to Homepage') }}
      </RouterLink>
    </UContainer>
  </div>
</template>

 