import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IAccountUpdateRequest } from "@myboothmanager/common";
import { CreateAccountDto } from "./create.dto";

export class UpdateAccountDto
  extends PartialType(OmitType(CreateAccountDto, ["loginPass"] as const))
  implements IAccountUpdateRequest {
  declare name?: string;
}
