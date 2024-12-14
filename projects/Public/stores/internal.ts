import type { ErrorCodes } from "@myboothmanager/common";

export const useInternalStore = defineStore("internal", () => {
  const isAPIFetchFailed = ref(false);
  const lastAPIError = ref<ErrorCodes | null>(null);

  return {
    isAPIFetchFailed,
    lastAPIError,
  };
});
