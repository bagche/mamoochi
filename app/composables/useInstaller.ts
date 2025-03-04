import { useStorage } from "@vueuse/core";

export default () => {
  const stepper = useTemplateRef("stepper");
  const installed = useStorage("app-installed", false);
  const dbConnected = ref(false);

  const nextDisabled = computed(() => {
    return !installed || !stepper?.hasNext;
  });
  const prevDisabled = computed(() => {
    return !stepper?.hasPrev;
  });
  return {
    stepper,
    installed,
    dbConnected,
    nextDisabled,
    prevDisabled,
  };
};
