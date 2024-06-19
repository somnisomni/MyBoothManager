import { APICaller, ErrorCodes, type IErrorResponse } from "@myboothmanager/common";
import { v4 as uuidV4 } from "uuid";
import { useInternalStore } from "~/stores/internal";

export default defineNuxtPlugin(() => {
  const devApiServerRegex = /^(https?:\/\/)?((.+\.local(host)?)|localhost|127\.0\.0\.1)(:\d+)?$/;
  const apiServerUrlObj = new URL(useRuntimeConfig().public.apiServerUrl);
  const apiServerUrl =
    useRuntimeConfig().public.apiServerUrl.match(devApiServerRegex) !== null
      ? `http://127.0.0.1:${apiServerUrlObj ? apiServerUrlObj.port :  20000}`
      : useRuntimeConfig().public.apiServerUrl;

  const $internalStore = useInternalStore();
  const apiCaller = new APICaller({
    host: apiServerUrl,
    group: "public",
  });

  async function wrap<T>(callee: () => Promise<T | IErrorResponse>, lazy = true): Promise<T | IErrorResponse> {
    // `useAsyncData()` key autogeneration is not reliable in this case like wrapping an API call function.
    // So the key should be generated manually, and uniquely by the callee function name.
    const calleeName = callee.toString().split(".").findLast((v) => v) ?? uuidV4();

    try {
      const { error, data } = await useAsyncData(calleeName, callee, { lazy, deep: false });

      if(error.value) throw error.value;
      if(!data.value) throw "Data is nullish";

      $internalStore.isAPIFetchFailed = false;
      return data.value;
    } catch(error) {
      console.error(`API Fetch Failed! (running on ${import.meta.env.SSR ? "server" : "client"}):`, error);
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
