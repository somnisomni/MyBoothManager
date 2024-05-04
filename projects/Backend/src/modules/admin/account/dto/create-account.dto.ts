import { IAccountCreateRequest } from "@myboothmanager/common";

export class CreateAccountDTO implements IAccountCreateRequest {
  declare name: string;
  declare loginId: string;
  declare loginPass: string;
}
