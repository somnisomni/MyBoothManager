import type { IAccountLoginRequest, IAccountLoginTokenData } from "@myboothmanager/common";
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
  async function adminLogin(data: IAccountLoginRequest): Promise<boolean | string> {
    const response = await AdminAPI.login(data);

    if(response && response instanceof Object) {
      $adminStore.currentAccount = {
        id: response.id,
        name: response.name,
        loginId: response.loginId,
      };
      if(response.superAdmin) $adminStore.currentAccount.superAdmin = response.superAdmin;

      authTokenData.value = ({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      return true;
    } else {
      invalidateLoginData();
      return response;
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
    isAuthTokenValid,
    invalidateLoginData,
  };
}, {
  persist: {
    storage: sessionStorage,
  },
});

export { useAuthStore };
