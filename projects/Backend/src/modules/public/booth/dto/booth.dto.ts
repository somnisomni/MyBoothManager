import { BoothStatus, IBoothExpense, IBoothModel, IBoothResponse, IBoothStatus, IImageUploadInfo } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class BoothResponseDto implements IBoothResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;
  @Expose() declare description: string;
  @Expose() declare location: string;
  @Expose() declare boothNumber?: string;
  @Expose() declare currencySymbol: string;
  @Expose() declare status: IBoothStatus;
  @Expose() declare dateClose: Date;
  @Expose() declare dateOpen: Date;
  @Expose() declare infoImage?: IImageUploadInfo;
  @Expose() declare bannerImage?: IImageUploadInfo;

  @Exclude() declare expenses: IBoothExpense[];
  @Exclude() declare ownerId: number;

  constructor(partial: Partial<IBoothModel>) {
    Object.assign(this, partial);
  }
}
