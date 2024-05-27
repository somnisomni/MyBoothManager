import { IFairResponse, ISuperAdminFairResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import { PublicFairResponseDto } from "@/modules/public/fair/dto/fair.dto";
import Fair from "@/db/models/fair";

export class FairResponseDto extends PublicFairResponseDto implements IFairResponse { }

@Exclude()
export class SuperAdminFairResponseDto extends FairResponseDto implements ISuperAdminFairResponse {
  @Expose() declare isPassed: boolean;
  @Expose() declare createdAt: Date;
  @Expose() declare updatedAt: Date;

  constructor(model: Fair) {
    super(model);

    this.isPassed = model.isPassed;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
