export interface IAccount {
  id: number;
  name: string;
  loginId: string;
  loginPassHash: string;
  loginCount: number;
  lastLoginAt: Date;
}
export type IAccountResponse = IAccount;

export type AccountCreateRequestKey = "name" | "loginId" | "loginPassHash";
export type IAccountCreateRequest = Pick<IAccount, AccountCreateRequestKey>;
