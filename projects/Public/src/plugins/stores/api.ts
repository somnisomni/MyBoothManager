import { APICaller, ErrorCodes, type IErrorResponse } from "@myboothmanager/common";
import { defineStore } from "pinia";
import { ref } from "vue";

const useAPIStore = defineStore("public", () => {
  const apiCaller = new APICaller(
    import.meta.env.VITE_MBM_API_SERVER_URL!,
    "public",
  );

  const isAPIFetchFailed = ref(false);

  async function apiWrapper<T>(callee: () => Promise<T | IErrorResponse>): Promise<T | IErrorResponse> {
    try {
      const response = await callee();
      isAPIFetchFailed.value = false;
      return response;
    } catch(error) {
      console.error("API Fetch Failed!", error);
      isAPIFetchFailed.value = true;
      return { errorCode: ErrorCodes.UNKNOWN_ERROR } as IErrorResponse;
    }
  }

  return {
    apiCaller,
    isAPIFetchFailed,
    apiWrapper,
  };
});

export { useAPIStore };
