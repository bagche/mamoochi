<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

// Define the buildId prop
const props = defineProps<{ buildId: number }>();
const emit = defineEmits(["finish"]);

const submitting = ref(false);
const { t } = useI18n();
const toast = useToast(); // Assuming you have a composable for toast notifications

const runBuild = async () => {
  try {
    submitting.value = true;

    // Call the build API using the buildId from props
    await $fetch("/api/builds/run", {
      method: "POST",
      body: JSON.stringify({
        buildId: props.buildId,
      }),
    });
    submitting.value = false;

    toast.add({
      title: t("Success"),
      description: t("Build pushed successfully"),
      color: "success",
    });
    emit("finish");
  } catch (error: any) {
    console.error(error.statusMessage);
    toast.add({
      color: "error",
      title: t("Error"),
      description: error.statusMessage || t("Build failed"),
    });
    submitting.value = false;
  }
};
</script>

<template>
  <UPopover>
    <UButton
      :label="$t('Update CDN')"
      color="neutral"
      variant="subtle"
      @click="runBuild"
    />

    <template #content>
      <p>Build Progress status</p>
    </template>
  </UPopover>
</template>
