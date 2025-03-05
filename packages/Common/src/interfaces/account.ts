/* === Common === */
interface IAccountCommon {
  id: number;
  name: string;
  loginId: string;
  lastSelectedBoothId?: number | null;
}

/* === Frontend === */
export interface IAccount extends IAccountCommon {
  superAdmin?: boolean;
}

/* === Model for Backend (DB) === */
export interface IAccountModel extends IAccountCommon {
  loginPassHash: string;
  loginCount: number;
  lastLoginAt?: Date | null;
}

/* === Requests === */
export interface IAccountCreateRequest {
  name: string;
  loginId: string;
  loginPass: string;
}

export type IAccountUpdateRequest = Partial<Omit<IAccountCreateRequest, "loginId" | "loginPass">>;
export type IAccountUpdatePasswordRequest = Pick<IAccountCreateRequest, "loginPass">;

export interface IAccountLoginRequest {
  loginId: string;
  loginPass: string;
  confirmLogoutExistingSession?: boolean;
}

export interface IAccountAuthRefreshRequest {
  id: number;  // Account ID (PK)
}

/* === Responses === */
export type IAccountResponse = IAccount;
export interface ISuperAdminAccountResponse extends Omit<IAccountResponse, "superAdmin">, Pick<IAccountModel, "loginCount" | "lastLoginAt"> {
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
export interface IAccountLoginResponse extends IAccount {
  accessToken: string;
}
