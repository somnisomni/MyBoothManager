import type { IDataModelBase } from "./base";

export interface IAccount extends IDataModelBase {
  id: number;
  name: string;
  loginId: string;
  loginPassHash: string;
  loginCount: number;
  lastLoginAt: Date;
  lastSelectedBoothId?: number;
}
export type IAccountResponse = IAccount;
export type IAccountUserland = Omit<IAccount, "loginPassHash" | "lastLoginAt" | "loginCount"> & { superAdmin?: boolean };

export interface IAccountLoginTokenData {
  accessToken: string;
  refreshToken: string;
}
export type IAccountLoginResponse = IAccountUserland & IAccountLoginTokenData;
export interface IAccountLoginRequest {
  loginId: string;
  loginPass: string;
  confirmLogoutExistingSession?: boolean;
}

export interface IAccountCreateRequest extends Pick<IAccount, "name" | "loginId"> {
  loginPass: string;
}
