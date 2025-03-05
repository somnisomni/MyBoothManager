import type { IAccountUpdatePasswordRequest } from "@myboothmanager/common";
import { PartialType, PickType } from "@nestjs/mapped-types";
import { CreateAccountRequestDto } from "./create.dto";

export class UpdateAccountPasswordRequestDto extends PartialType(PickType(CreateAccountRequestDto, [ "loginPass" ] as const)) implements IAccountUpdatePasswordRequest {
  declare loginPass: string;
}
