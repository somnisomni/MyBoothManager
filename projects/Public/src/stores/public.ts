import { APICaller } from "@myboothmanager/common";
import { defineStore } from "pinia";

const usePublicStore = defineStore("public", () => {
  const apiCaller = new APICaller(import.meta.env.VITE_MBM_API_SERVER_URL!, "public");

  return {
    apiCaller,
  };
});

export { usePublicStore };
