<script setup lang="ts">
const { t } = useI18n();
const {
  dbConnected,
  currentStep,
  dbMigrated,
  runMigrations,
  isMigrating,
  dbLoaded,
  runDbLoading,
  dbLoading,
  adminLoaded,
} = useInstaller();
const stepper = useTemplateRef("stepper");

const items = [
  {
    title: t("D1 Database Connection"),
    slot: "dbConnected",
    description: t(
      "Enter and verify your D1 Database connection details to begin the installation process."
    ),
    icon: "i-lucide-database",
  },
  {
    title: t("Initialize Database Schema"),
    slot: "migrationLoad",
    description: t(
      "Apply and validate your database schema migrations to set up all required tables."
    ),
    icon: "i-lucide-database-zap",
  },
  {
    title: t("Load Default Data"),
    slot: "loadDatabase",
    description: t(
      "Import default configuration and sample data into your database."
    ),
    icon: "i-lucide-database",
  },
  {
    title: t("Admin Account Setup"),
    slot: "admin",
    description: t(
      "Create your first administrator account to manage your application."
    ),
    icon: "i-lucide-shield-user",
  },
  {
    title: t("Installation Complete"),
    slot: "finish",
    description: t(
      "Installation is complete. Your application is now fully configured and ready to use!"
    ),
    icon: "i-lucide-list-checks",
  },
];
</script>

<template>
  <div
    class="mx-auto flex flex-col items-center px-4 justify-center h-screen container"
  >
    <UCard :ui="{ root: ' ' }">
      <template #header>
        <div class="flex items-center w-full justify-between">
          <h1 class="text-2xl">{{ t("Mamoochi Database  Installation") }}</h1>
          <div class="flex">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </template>
      <UStepper
        ref="stepper"
        v-model="currentStep"
        orientation="vertical"
        disabled
        :items="items"
        class="w-full max-w-5xl"
      >
        <template #dbConnected="{ item }">
          <InstallerDatabaseConnected />
        </template>
        <template #migrationLoad="{ item }">
          <InstallerMigrationsInit />
        </template>
        <template #loadDatabase="{ item }">
          <InstallerDatabaseLoading />
        </template>
        <template #admin="{ item }">
          <InstallerAdminLoading />
        </template>
        <template #finish="{ item }">
          <InstallerFinish />
        </template>
      </UStepper>
      <div v-if="currentStep !== 4" class="flex gap-3 pt-4 mt-4">
        <UButton
          v-if="currentStep !== 0"
          :block="currentStep === 4"
          icon="i-lucide-arrow-right"
          :label="$t('Previous')"
          size="xl"
          :disabled="!stepper?.hasPrev"
          color="secondary"
          @click="stepper?.prev()"
        />
        <UButton
          v-if="currentStep === 0 && dbConnected"
          color="success"
          size="xl"
          block
          icon="i-lucide-wand-sparkles"
          :label="$t('Start Installation')"
          @click="stepper?.next()"
        />
        <UButton
          v-else-if="currentStep === 1 && !dbMigrated"
          color="success"
          size="xl"
          block
          icon="i-lucide-database-zap"
          :label="$t('Run Migrations')"
          :loading="isMigrating"
          @click="runMigrations()"
        />
        <UButton
          v-else-if="currentStep === 1 && dbMigrated"
          color="success"
          size="xl"
          block
          icon="i-lucide-database"
          :label="$t('Proceed to Defaults app Database')"
          @click="stepper?.next()"
        />
        <UButton
          v-else-if="currentStep === 2 && !dbLoaded"
          color="success"
          size="xl"
          block
          icon="i-lucide-gear"
          :label="$t('Proceed to Defaults app Database')"
          :loading="dbLoading"
          @click="runDbLoading()"
        />
        <UButton
          v-else-if="currentStep === 2 && dbLoaded"
          color="success"
          size="xl"
          block
          icon="i-lucide-shield-user"
          :label="$t('Adding Admin User')"
          @click="stepper?.next()"
        />

        <UButton
          v-else-if="currentStep === 3"
          color="success"
          size="xl"
          block
          :disabled="!adminLoaded"
          icon="i-lucide-shield-check"
          :label="$t('Finish Installing')"
          @click="stepper?.next()"
        />
      </div>
    </UCard>
  </div>
</template>
