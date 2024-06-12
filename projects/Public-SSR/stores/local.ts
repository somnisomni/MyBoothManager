const useLocalStore = defineStore("local", () => {
  const boothPageSettings = reactive({
    enableAutoRefresh: true,
    lastVisitedBoothId: undefined,
  } as IBoothPageSettings);

  return {
    boothPageSettings,
  };
}, {
  persist: {
    storage: persistedState.localStorage,
  },
});

export interface IBoothPageSettings {
  enableAutoRefresh: boolean;
  lastVisitedBoothId?: number;
}

export { useLocalStore };
