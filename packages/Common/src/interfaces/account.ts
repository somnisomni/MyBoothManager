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

export interface IAccountLoginResponse extends IAccountUserland {
  token: string;
  tokenExpiresIn: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
}
export interface IAccountLoginRequest {
  loginId: string;
  loginPass: string;
}

export type AccountCreateRequestKey = "name" | "loginId" | "loginPassHash";
export type IAccountCreateRequest = Pick<IAccount, AccountCreateRequestKey>;
