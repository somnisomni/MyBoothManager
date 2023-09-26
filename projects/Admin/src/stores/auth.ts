import type { IAccountLoginRequest, IAccountLoginResponse, IAccountLoginTokenData, IAccountNeedLoginResponse } from "@myboothmanager/common";
import { defineStore } from "pinia";
import { ref } from "vue";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "./admin";

const useAuthStore = defineStore("auth", () => {
  /* Dependencies (NOT TO BE EXPORTED) */
  const $adminStore = useAdminStore();

  /* States */
  const authTokenData = ref<IAccountLoginTokenData | null>(null);

  /* Actions */
  function registerAuthData(data: IAccountLoginResponse): void {
    $adminStore.currentAccount = {
      id: data.id,
      name: data.name,
      loginId: data.loginId,
    };
    if(data.superAdmin) $adminStore.currentAccount.superAdmin = data.superAdmin;

    authTokenData.value = ({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }

  async function adminLogin(data: IAccountLoginRequest): Promise<boolean | string> {
    const response = await AdminAPI.login(data);

    if(response && response instanceof Object) {
      registerAuthData(response);
      return true;
    } else {
      invalidateLoginData();
      return response;
    }
  }

  async function adminAuthRefresh(): Promise<boolean | string> {
    if(!$adminStore.currentAccount || !authTokenData.value) return false;

    const response = await AdminAPI.refreshAuth({
      id: $adminStore.currentAccount.id,
      refreshToken: authTokenData.value.refreshToken!,
    });

    if((response as IAccountNeedLoginResponse).needLogin) {
      // Refresh token is expired, require re-login
      invalidateLoginData();
      return false;
    } else if(typeof response === "object" && (response as IAccountLoginResponse).accessToken) {
      // Authorization refreshed
      registerAuthData(response as IAccountLoginResponse);
      return true;
    } else {
      // Error
      return response as string;
    }
  }

  function isAuthTokenValid(): boolean {
    if(authTokenData.value
       && authTokenData.value.accessToken
       && authTokenData.value.refreshToken) {
      return true;
    }

    return false;
  }

  function invalidateLoginData(): void {
    $adminStore.currentAccount = null;
    authTokenData.value = null;
  }

  return {
    authTokenData,

    adminLogin,
    adminAuthRefresh,
    isAuthTokenValid,
    invalidateLoginData,
  };
}, {
  persist: {
    storage: sessionStorage,
  },
});

export { useAuthStore };
