import { ErrorCodes, type IAccountLoginRequest, type IAccountLoginResponse, type IAccountLoginTokenData, type ISuccessResponse } from "@myboothmanager/common";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "./admin";

const useAuthStore = defineStore("auth", () => {
  /* Dependencies (NOT TO BE EXPORTED) */
  const $adminStore = useAdminStore();

  /* States */
  const id = ref<number | null>(null);
  const authTokenData = ref<IAccountLoginTokenData | null>(null);

  /* Computed */
  const isAuthTokenValid = computed<boolean>(() =>
    !!id.value &&
    !!authTokenData.value &&
    !!authTokenData.value.accessToken &&
    !!authTokenData.value.refreshToken);

  /* Actions */
  function registerAuthData(data: IAccountLoginResponse): void {
    id.value = data.id;
    $adminStore.currentAccount = {
      id: data.id,
      name: data.name,
      loginId: data.loginId,
      lastSelectedBoothId: data.lastSelectedBoothId,
    };
    if(data.superAdmin) $adminStore.currentAccount.superAdmin = data.superAdmin;

    authTokenData.value = ({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }

  async function adminLogin(data: IAccountLoginRequest): Promise<boolean | ErrorCodes> {
    const response = await AdminAPI.login(data);

    if(response && typeof response === "object") {
      registerAuthData(response);
      return true;
    } else {
      invalidateLoginData();
      return response;
    }
  }

  async function adminAuthRefresh(): Promise<boolean | ErrorCodes> {
    if(!id.value || !authTokenData.value) return false;

    const response = await AdminAPI.refreshAuth({
      id: id.value,
      refreshToken: authTokenData.value.refreshToken!,
    });

    if(response && typeof response === "object") {
      registerAuthData(response);
      return true;
    } else {
      switch(response) {
        case ErrorCodes.AUTH_TOKEN_NEED_REFRESH:
        case ErrorCodes.INVALID_REFRESH_TOKEN:
        case ErrorCodes.EXPIRED_REFRESH_TOKEN:
        case ErrorCodes.NEED_RELOGIN:
          invalidateLoginData();
          return false;
        default:
          return response;
      }
    }
  }

  async function adminAuthCheck(): Promise<boolean | ErrorCodes> {
    if(!id.value || !authTokenData.value) return true;

    const response = await AdminAPI.checkAuth();

    if(!response || !(response as ISuccessResponse).success) {
      invalidateLoginData();
      return ErrorCodes.NEED_RELOGIN;
    }

    return true;
  }

  function invalidateLoginData(): void {
    $adminStore.clearAllStates();
    id.value = null;
    authTokenData.value = null;
  }

  return {
    id,
    authTokenData,

    isAuthTokenValid,

    adminLogin,
    adminAuthRefresh,
    adminAuthCheck,
    invalidateLoginData,
  };
}, {
  persist: {
    storage: sessionStorage,
  },
});

export { useAuthStore };
