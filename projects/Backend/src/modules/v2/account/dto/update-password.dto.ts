import { PartialType, PickType } from "@nestjs/mapped-types";
import { IAccountUpdatePasswordRequest } from "@myboothmanager/common";
import { CreateAccountDto } from "./create.dto";

export class UpdateAccountPasswordDto
  extends PartialType(PickType(CreateAccountDto, ["loginPass"] as const))
  implements IAccountUpdatePasswordRequest {
  declare loginPass: string;
}
