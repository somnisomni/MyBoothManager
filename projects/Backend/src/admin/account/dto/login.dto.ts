import { IAccount } from "@myboothmanager/common";

export class LoginDTO implements Partial<IAccount> {
  loginId!: string;
  loginPass!: string;
}
