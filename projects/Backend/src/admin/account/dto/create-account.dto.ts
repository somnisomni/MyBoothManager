import { IAccountCreateRequest } from "@myboothmanager/common";

export class CreateAccountDTO implements IAccountCreateRequest {
  name!: string;
  loginId!: string;
  loginPass!: string;
}
