import { APICaller, ErrorCodes, type IErrorResponse } from "@myboothmanager/common";
import { v4 as uuidV4 } from "uuid";

export default defineNuxtPlugin((nuxt) => {
  const devApiServerRegex = /^(https?:\/\/)?((.+\.local(host)?)|localhost|127\.0\.0\.1)(:\d+)?$/;
  const apiServerUrlObj = new URL(useRuntimeConfig().public.apiServerUrl);
  const apiServerUrl =
    useRuntimeConfig().public.apiServerUrl.match(devApiServerRegex) !== null
      ? `http://127.0.0.1:${apiServerUrlObj ? apiServerUrlObj.port :  20000}`
      : useRuntimeConfig().public.apiServerUrl;

  const $internalStore = useInternalStore();
  const apiCaller = new APICaller({ host: apiServerUrl });

  const calleeNameMatcher = /.+\.apiCaller\.(.+)\((.+)?\)$/;

  async function wrap<T>(callee: () => Promise<T | IErrorResponse>, lazy = false, server = true, deep = true): Promise<T | IErrorResponse> {
    // `useAsyncData()` key autogeneration is not reliable in this case like wrapping an API call function.
    // So the key should be generated manually, and uniquely by the callee function name.
    const calleeName = callee.toString().match(calleeNameMatcher)?.[1] ?? uuidV4();

    try {
      const { error, data } = await nuxt.runWithContext(async () => await useAsyncData(calleeName, callee, { lazy, server, deep }));

      if(error.value) throw error.value;
      if(!data.value) throw "Data is nullish";
      if(typeof data.value === "object" && "errorCode" in data.value) $internalStore.lastAPIError = data.value.errorCode;

      $internalStore.isAPIFetchFailed = false;
      return data.value;
    } catch(error) {
      console.error(
        `[API] Fetch failed! (running on ${import.meta.env.SSR ? "server" : "client"}):\n`
        + `  - Error: ${error}`
        + (import.meta.env.SSR ? `  - API fetch wraper callee function: ${callee.toString()}` : ""),
      );

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
