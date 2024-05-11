import type { IBoothExpense, IBoothUpdateRequest } from "@myboothmanager/common";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateBoothRequestDto } from "./create-booth.dto";

export class UpdateBoothRequestDto extends PartialType(OmitType(CreateBoothRequestDto, ["currencySymbol"] as const)) implements IBoothUpdateRequest {
  declare expenses?: Array<IBoothExpense>;
}
