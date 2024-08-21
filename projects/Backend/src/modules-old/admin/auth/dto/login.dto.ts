import { IAccountLoginRequest, IAccountLoginResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class LoginRequestDto implements IAccountLoginRequest {
  @Expose() declare loginId: string;
  @Expose() declare loginPass: string;
  @Expose() declare confirmLogoutExistingSession?: boolean;

  constructor(data: IAccountLoginRequest) {
    this.loginId = data.loginId;
    this.loginPass = data.loginPass;
    this.confirmLogoutExistingSession = data.confirmLogoutExistingSession;
  }
}

@Exclude()
export class LoginResponseDto implements IAccountLoginResponse {
  @Expose() declare id: number;
  @Expose() declare loginId: string;
  @Expose() declare name: string;
  @Expose() declare lastSelectedBoothId?: number | null;
  @Expose() declare superAdmin?: boolean;
  @Expose() declare accessToken: string;

  constructor(data: IAccountLoginResponse) {
    this.id = data.id;
    this.loginId = data.loginId;
    this.name = data.name;
    this.lastSelectedBoothId = data.lastSelectedBoothId;
    this.superAdmin = data.superAdmin;
    this.accessToken = data.accessToken;
  }
}
