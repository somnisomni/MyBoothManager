import { PartialType, PickType } from "@nestjs/mapped-types";
import { IAccountUpdatePasswordRequest } from "@myboothmanager/common";
import { CreateAccountRequestDto } from "./create.dto";

export class UpdateAccountPasswordRequestDto extends PartialType(PickType(CreateAccountRequestDto, ["loginPass"] as const)) implements IAccountUpdatePasswordRequest {
  declare loginPass: string;
}
