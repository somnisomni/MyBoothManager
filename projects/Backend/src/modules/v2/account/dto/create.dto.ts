import { IAccountCreateRequest } from "@myboothmanager/common";

export class CreateAccountDto implements IAccountCreateRequest {
  declare name: string;
  declare loginId: string;
  declare loginPass: string;
}
