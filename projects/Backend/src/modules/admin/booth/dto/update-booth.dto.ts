import type { IBoothExpense, IBoothUpdateRequest } from "@myboothmanager/common";
import { PartialType } from "@nestjs/mapped-types";
import { CreateBoothRequestDto } from "./create-booth.dto";

export class UpdateBoothRequestDto extends PartialType(CreateBoothRequestDto) implements IBoothUpdateRequest {
  declare expenses?: Array<IBoothExpense>;
}
