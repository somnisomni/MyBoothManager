import { APICaller, ErrorCodes, type IErrorResponse } from "@myboothmanager/common";

const useAPIStore = defineStore("public", () => {
  const apiCaller = new APICaller({
    host: useRuntimeConfig().public.apiServerUrl,
    group: "public",
  });

  const isAPIFetchFailed = ref(false);

  async function apiWrapper<T>(callee: () => Promise<T | IErrorResponse>, lazy = true): Promise<T | IErrorResponse> {
    try {
      const { error, data } = await useAsyncData(() => callee(), { lazy, deep: false });

      if(error.value) throw error.value;
      if(!data.value) throw "Data is nullish";

      isAPIFetchFailed.value = false;
      return data.value;
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
