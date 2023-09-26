import { IDataModelBase } from "./base";

export interface IAccount extends IDataModelBase {
  id: number;
  name: string;
  loginId: string;
  loginPassHash: string;
  loginCount: number;
  lastLoginAt: Date;
}
export type IAccountResponse = IAccount;
export type IAccountUserland = Omit<IAccount, "loginPassHash" | "lastLoginAt" | "loginCount"> & { superAdmin?: boolean };

export interface IAccountLoginTokenData {
  accessToken: string;
  refreshToken: string;
}
export type IAccountLoginResponse = IAccountUserland & IAccountLoginTokenData;
export type IAccountNeedRefreshResponse = { needRefresh: true };
export type IAccountNeedLoginResponse = { needLogin: true };
export interface IAccountLoginRequest {
  loginId: string;
  loginPass: string;
}

export type AccountCreateRequestKey = "name" | "loginId" | "loginPassHash";
export type IAccountCreateRequest = Pick<IAccount, AccountCreateRequestKey>;
