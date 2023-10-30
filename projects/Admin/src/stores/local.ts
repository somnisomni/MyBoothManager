import { defineStore } from "pinia";
import { reactive } from "vue";

const useLocalStore = defineStore("local", () => {
  const settings = reactive({

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
