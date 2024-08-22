import type { IBoothExpense, IBoothRelatedLink, IBoothUpdateRequest } from "@myboothmanager/common";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateBoothRequestDto } from "./create.dto";

export class UpdateBoothRequestDto extends PartialType(OmitType(CreateBoothRequestDto, ["fairId", "currencySymbol"] as const)) implements Omit<IBoothUpdateRequest, "datesOpenInFair"> {
  declare noticeContent?: string | null;
  declare relatedLinks?: Array<IBoothRelatedLink>;
  declare expenses?: Array<IBoothExpense>;
}
