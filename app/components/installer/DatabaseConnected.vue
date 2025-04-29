<script setup lang="ts">
const { dbConnected, checkDbConnections } = useInstaller();
checkDbConnections();

const runtimeConfig = useRuntimeConfig();
console.log(runtimeConfig.turnstile?.secretKey);

// Validate runtimeConfig properties
const isGithubConfigValid = computed(() => {
  return (
    !!runtimeConfig?.githubToken &&
    !!runtimeConfig?.githubOwner &&
    !!runtimeConfig?.githubRepo
  );
});

const isTurnstileConfigValid = computed(() => {
  return (
    !!runtimeConfig.public.turnstile?.siteKey &&
    !!runtimeConfig.turnstile?.secretKey
  );
});
</script>

<template>
  <div class="w-full gap-5 flex flex-col">
    <!-- Database Connection Status -->
    <div class="flex flex-col gap-5 justify-between">
      <UAlert
        v-if="dbConnected"
        class="flex"
        color="success"
        variant="subtle"
        :title="$t('Database Connection Successful')"
        :description="
          $t(
            'The application has established a secure connection to the D1 database. You can now continue with the installation process.'
          )
        "
        icon="i-lucide-database"
      />
      <UAlert
        v-else
        color="error"
        variant="subtle"
        :title="$t('Database Connection Failed')"
        :description="
          $t(
            'Unable to connect to the database. Please verify your wrangler.toml configuration, ensure database migrations are applied, and refresh the page.'
          )
        "
        icon="i-lucide-alert-circle"
      />
    </div>

    <!-- GitHub Configuration Status -->
    <div class="flex flex-col gap-5 justify-between">
      <UAlert
        v-if="isGithubConfigValid"
        class="flex"
        color="success"
        variant="subtle"
        :title="$t('GitHub Configuration Valid')"
        :description="
          $t(
            'GitHub token, owner, and repository are correctly configured. The application is ready to interact with the GitHub API.'
          )
        "
        icon="i-lucide-github"
      />
      <UAlert
        v-else
        color="error"
        variant="subtle"
        :title="$t('GitHub Configuration Missing')"
        :description="
          $t(
            'One or more GitHub configuration values (token, owner, or repository) are missing or invalid. Please update your runtime configuration.'
          )
        "
        icon="i-lucide-alert-circle"
      />
    </div>

    <!-- Turnstile Configuration Status -->
    <div class="flex flex-col gap-5 justify-between">
      <UAlert
        v-if="isTurnstileConfigValid"
        class="flex"
        color="success"
        variant="subtle"
        :title="$t('Turnstile Configuration Valid')"
        :description="
          $t(
            'Cloudflare Turnstile site key and secret key are properly configured. CAPTCHA verification is ready to use.'
          )
        "
        icon="i-lucide-shield-check"
      />
      <UAlert
        v-else
        color="error"
        variant="subtle"
        :title="$t('Turnstile Configuration Missing')"
        :description="
          $t(
            'Cloudflare Turnstile site key or secret key is not configured. Please set NUXT_TURNSTILE_SECRET_KEY and site key in your environment.'
          )
        "
        icon="i-lucide-alert-circle"
      />
    </div>
  </div>
</template>
