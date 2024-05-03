/* === Common === */
interface IAccountCommon {
  id: number;
  name: string;
  loginId: string;
  lastSelectedBoothId?: number | null;
}

export interface IAccountAuthToken {
  accessToken: string;
  refreshToken: string;
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

export interface IAccountUpdateRequest extends Partial<Omit<IAccountCreateRequest, "loginId">> { }

export interface IAccountLoginRequest {
  loginId: string;
  loginPass: string;
  confirmLogoutExistingSession?: boolean;
}

/* === Responses === */
export interface IAccountResponse extends IAccount { }
export interface IAccountLoginResponse extends IAccount, IAccountAuthToken { }
