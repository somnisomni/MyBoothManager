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
  superAdmin?: boolean | null;
}

/* === Model for Backend (DB) === */
export interface IAccountModel extends IAccountCommon {
  loginCount: number;
  loginPassHash: string;
  lastLoginAt: Date;
}

/* === Requests === */
export interface IAccountCreateRequest {
  name: string;
  loginId: string;
  loginPass: string;
}

export interface IAccountLoginRequest {
  loginId: string;
  loginPass: string;
  confirmLogoutExistingSession?: boolean | null;
}

/* === Responses === */
export interface IAccountLoginResponse extends IAccount, IAccountAuthToken { }
