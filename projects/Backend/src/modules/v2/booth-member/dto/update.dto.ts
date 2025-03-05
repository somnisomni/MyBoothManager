import type { IBoothMemberUpdateRequest } from "@myboothmanager/common";
import { PartialType } from "@nestjs/mapped-types";
import { CreateBoothMemberRequestDto } from "./create.dto";

export class UpdateBoothMemberRequestDto extends PartialType(CreateBoothMemberRequestDto) implements IBoothMemberUpdateRequest {
  declare boothId: number;
}
