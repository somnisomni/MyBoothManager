import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IAccountUpdateRequest } from "@myboothmanager/common";
import { CreateAccountRequestDto } from "./create.dto";

export class UpdateAccountRequestDto extends PartialType(OmitType(CreateAccountRequestDto, ["loginPass"] as const)) implements IAccountUpdateRequest {
  declare name?: string;
}
