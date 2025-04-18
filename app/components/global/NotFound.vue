<template>
  <div class="flex items-center h-[calc(100vh-7rem)]">
    <UContainer
      class="flex flex-col items-center max-w-7xl mx-auto gap-6 text-center"
    >
      <UIcon name="i-lucide-search-x" class="text-yellow-500 size-40" />
      <h2 class="text-3xl font-semibold">{{ $t("404 - Page Not Found") }}</h2>
      <p class="text-lg">
        {{
          $t("The page you are looking for doesn’t exist or has been moved.")
        }}
      </p>
      <p class="text-lg">
        {{ $t("Please check the URL or return to the homepage.") }}
      </p>
      <RouterLink to="/" class="mt-4 text-blue-500 hover:underline">
        {{ $t("Return to Homepage") }}
      </RouterLink>
    </UContainer>
  </div>
</template>
