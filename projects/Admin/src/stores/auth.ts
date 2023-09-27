import type { IAccountLoginRequest, IAccountLoginResponse, IAccountLoginTokenData, IAccountNeedLoginResponse } from "@myboothmanager/common";
import { defineStore } from "pinia";
import { ref } from "vue";
import AdminAPI from "@/lib/api-admin";
import { useAdminStore } from "./admin";

const useAuthStore = defineStore("auth", () => {
  /* Dependencies (NOT TO BE EXPORTED) */
  const $adminStore = useAdminStore();

  /* States */
  const id = ref<number | null>(null);
  const authTokenData = ref<IAccountLoginTokenData | null>(null);

  /* Actions */
  function registerAuthData(data: IAccountLoginResponse): void {
    id.value = data.id;
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
    if(!id.value || !authTokenData.value) return false;

    const response = await AdminAPI.refreshAuth({
      id: id.value,
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
    if(id.value
       && authTokenData.value
       && authTokenData.value.accessToken
       && authTokenData.value.refreshToken) {
      return true;
    }

    return false;
  }

  function invalidateLoginData(): void {
    $adminStore.currentAccount = null;
    id.value = null;
    authTokenData.value = null;
  }

  return {
    id,
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
