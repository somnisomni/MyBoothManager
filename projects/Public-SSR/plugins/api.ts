import { APICaller, ErrorCodes, type IErrorResponse } from "@myboothmanager/common";
import { useInternalStore } from "~/stores/internal";

export default defineNuxtPlugin(() => {
  const devApiServerRegex = /^(https?:\/\/)?((.+\.local(host)?)|localhost|127\.0\.0\.1)(:\d+)?$/;
  const apiServerUrlObj = new URL(useRuntimeConfig().public.apiServerUrl);
  const apiServerUrl =
    useRuntimeConfig().public.apiServerUrl.match(devApiServerRegex) !== null
      ? `http://localhost:${apiServerUrlObj ? apiServerUrlObj.port :  20000}`
      : useRuntimeConfig().public.apiServerUrl;

  const $internalStore = useInternalStore();
  const apiCaller = new APICaller({
    host: apiServerUrl,
    group: "public",
  });

  async function wrap<T>(callee: () => Promise<T | IErrorResponse>, lazy = true): Promise<T | IErrorResponse> {
    try {
      const { error, data } = await useAsyncData(() => callee(), { lazy, deep: false });

      if(error.value) throw error.value;
      if(!data.value) throw "Data is nullish";

      $internalStore.isAPIFetchFailed = false;
      return data.value;
    } catch(error) {
      console.error(`API Fetch Failed! running on ${import.meta.env.MODE}`, error);
      $internalStore.isAPIFetchFailed = true;
      return { errorCode: ErrorCodes.UNKNOWN_ERROR } as IErrorResponse;
    }
  }

  return {
    provide: {
      publicAPI: {
        apiCaller,
        wrap,
      },
    },
  };
});
