interface IBoothPageSettings {
  enableAutoRefresh: boolean;
  lastVisitedBoothId?: number;
}

export const useLocalStore = defineStore("local", () => {
  const boothPageSettings = reactive({
    enableAutoRefresh: true,
    lastVisitedBoothId: undefined,
  } as IBoothPageSettings);

  return {
    boothPageSettings,
  };
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
});
