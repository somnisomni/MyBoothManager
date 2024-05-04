import type Booth from "@/db/models/booth";
import { IBoothAdminResponse, IBoothExpense } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import { PublicBoothResponseDto } from "@/modules/public/booth/dto/booth.dto";

@Exclude()
export class AdminBoothResponseDto extends PublicBoothResponseDto implements IBoothAdminResponse {
  @Expose() declare expenses: Array<IBoothExpense>;

  constructor(model: Booth) {
    super(model);

    this.expenses = model.get("expenses");
  }
}
