import { IAccount } from "@myboothmanager/common";

export class CreateAccountDTO implements Partial<IAccount> {
  name!: string;
  loginId!: string;
  loginPassHash!: string;
}
