import { defineStore } from "pinia";
import { reactive } from "vue";

interface ILocalSettings {
  lastLoginId: string | null;
  language: string | null;
}

const useLocalStore = defineStore("local", () => {
  const settings: ILocalSettings = reactive({
    lastLoginId: null,
    language: "ko",
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
