import { IAccountLoginRequest } from "@myboothmanager/common";

export class LoginDTO implements IAccountLoginRequest {
  loginId!: string;
  loginPass!: string;
}
