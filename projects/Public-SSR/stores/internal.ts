export const useInternalStore = defineStore("internal", () => {
  const isAPIFetchFailed = ref(false);

  return {
    isAPIFetchFailed,
  };
});
