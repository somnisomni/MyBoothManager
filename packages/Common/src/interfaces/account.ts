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
export type IAccountUserland = Omit<IAccount, "loginPassHash" | "lastLoginAt" | "loginCount">;

export interface IAccountLoginResponse extends IAccountUserland {
  id: number;
  name: string;
  loginId: string;

  token: string;
  tokenExpiresIn: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
}

export type AccountCreateRequestKey = "name" | "loginId" | "loginPassHash";
export type IAccountCreateRequest = Pick<IAccount, AccountCreateRequestKey>;
