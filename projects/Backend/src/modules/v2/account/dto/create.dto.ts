import { IAccountCreateRequest } from "@myboothmanager/common";

export class CreateAccountRequestDto implements IAccountCreateRequest {
  declare name: string;
  declare loginId: string;
  declare loginPass: string;
}
