import { defineStore } from "pinia";
import { reactive } from "vue";

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
    storage: localStorage,
  },
});

export interface IBoothPageSettings {
  enableAutoRefresh: boolean;
  lastVisitedBoothId?: number;
}

export { useLocalStore };
