import { BoothStatus, IBoothExpense, IBoothModel, IBoothResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class BoothResponseDto implements IBoothResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;
  @Expose() declare description: string;
  @Expose() declare location: string;
  @Expose() declare boothNumber?: string;
  @Expose() declare currencySymbol: string;
  @Expose() declare status: BoothStatus;
  @Expose() declare statusPublishContent?: boolean;
  @Expose() declare statusReason?: string;
  @Expose() declare dateClose: Date;
  @Expose() declare dateOpen: Date;
  @Expose() declare infoImageUrl?: string;
  @Expose() declare bannerImageUrl?: string;

  @Exclude() declare expenses: IBoothExpense[];
  @Exclude() declare ownerId: number;

  constructor(partial: Partial<IBoothModel>) {
    Object.assign(this, partial);
  }
}
