import * as CT from "@myboothmanager/common";
import { BaseAdminAPI } from "@/lib/api-admin";
import { useAdminStore } from "@/plugins/stores/admin";

export default class SuperAdminAPI extends BaseAdminAPI {
  private static get isSuperAdmin(): boolean {
    return useAdminStore().currentAccount?.superAdmin ?? false;
  }

  protected static override async apiCallWrapper<T>(callee: () => Promise<T | CT.IErrorResponse>): Promise<CT.ErrorCodes | T> {
    if(this.isSuperAdmin) {
      return super.apiCallWrapper(callee);
    } else {
      return CT.ErrorCodes.NO_ACCESS;
    }
  }

  /* == Endpoints == */
  /* Fetch */
  static async fetchAllAccounts() {
    return await this.apiCallWrapper<Array<CT.ISuperAdminAccountResponse>>(() => this.API.GET("account/all"));
  }

  static async fetchAllFairs() {
    return await this.apiCallWrapper<Array<CT.IFairResponse>>(() => this.API.GET("fair/all"));
  }

  /* Create */
  static async createAccount(payload: CT.IAccountCreateRequest) {
    return await this.apiCallWrapper<CT.IAccountResponse>(() => this.API.POST("account", payload));
  }

  static async createFair(payload: CT.IFairCreateRequest) {
    return await this.apiCallWrapper<CT.IFairResponse>(() => this.API.POST("fair", payload));
  }
}
