<script setup lang="ts">
const { t } = useI18n();

const items = [
  {
    title: t("Database"),
    slot: "database",
    description: t("Add D1 Database Details"),
    icon: "i-lucide-database",
  },
  {
    title: t("Initial Database"),
    slot: "init",
    description: t("Initializing Database Schema"),
    icon: "i-lucide-database-zap",
  },
  {
    title: t("Admin Register"),
    slot: "admin",
    description: t("Register Admin User"),
    icon: "i-lucide-shield-user",
  },
  {
    title: t("Finish"),
    slot: "finish",
    description: t("App installed Successfully"),
    icon: "i-lucide-list-checks",
  },
];
const stepper = useTemplateRef("stepper");
</script>

<template>
  <div class="w-full min-h-screen">
    <UContainer>
      <div class="max-w-7xl mx-auto flex flex-col items-center pt-10 px-4">
        <UCard
          :ui="{
            root: 'min-h-200',
          }"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <h1 class="text-2xl">{{ $t("Installing App") }}</h1>
              <UButtonGroup size="md" variant="outline">
                <UButton
                  icon="i-lucide-arrow-right"
                  :label="t('Prev')"
                  variant="outline"
                  :disabled="!stepper?.hasPrev"
                  @click="stepper?.prev()"
                />
                <UButton
                  class="cursor-pointer"
                  :label="t('Next')"
                  variant="outline"
                  icon="i-lucide-arrow-left"
                  :disabled="!stepper?.hasNext"
                  @click="stepper?.next()"
                />
              </UButtonGroup>
            </div>
          </template>
          <UStepper ref="stepper" disabled :items="items" class="w-full">
            <template #database="{ item }">
              <InstallerAddDatabase />
            </template>
            <template #init="{ item }">
              <InstallerInitDatabase />
            </template>
            <template #admin="{ item }">
              <InstallerAdminInit />
            </template>
            <template #finish="{ item }">
              <InstallerFinish />
            </template>
          </UStepper>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
