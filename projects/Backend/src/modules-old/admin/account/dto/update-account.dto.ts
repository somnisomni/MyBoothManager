import { PartialType } from "@nestjs/mapped-types";
import { IAccountUpdateRequest } from "@myboothmanager/common";
import { CreateAccountDTO } from "./create-account.dto";

export class UpdateAccountDto extends PartialType(CreateAccountDTO) implements IAccountUpdateRequest {
  declare name?: string;
  declare loginPass?: string;
}
