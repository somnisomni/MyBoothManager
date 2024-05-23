import { defineStore } from "pinia";
import { reactive } from "vue";

interface ILocalSettings {
  lastLoginId: string | null;
}

const useLocalStore = defineStore("local", () => {
  const settings: ILocalSettings = reactive({
    lastLoginId: null,
  });

  return {
    settings,
  };
}, {
  persist: {
    storage: localStorage,
  },
});

export { useLocalStore };
