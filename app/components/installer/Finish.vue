<template>
  <div class="w-full gap-5 flex flex-col">
    <div class="flex flex-col gap-5 justify-between">
      <UAlert
        class="flex"
        color="success"
        variant="outline"
        :title="$t('App Successfully installed')"
        :description="
          $t(
            'Your application is successfully installed, please update installed value in app.config.ts.'
          )
        "
        icon="i-lucide-terminal"
      />
    </div>
  </div>
</template>
