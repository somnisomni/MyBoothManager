import type { IBoothExpense, IBoothMember, IBoothUpdateReuqest } from "@myboothmanager/common";
import { PartialType } from "@nestjs/mapped-types";
import { CreateBoothDTO } from "./create-booth.dto";

export class UpdateBoothDTO extends PartialType(CreateBoothDTO) implements IBoothUpdateReuqest {
  members?: Array<IBoothMember>;
  expenses?: Array<IBoothExpense>;
}
