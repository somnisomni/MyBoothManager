import { IBoothResponse, IBoothStatus, IFairInfo, IImageUploadInfo } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import Booth from "@/db/models/booth";

@Exclude()
export class PublicBoothResponseDto implements IBoothResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;
  @Expose() declare description?: string | null;
  @Expose() declare location?: string | null;
  @Expose() declare boothNumber?: string | null;
  @Expose() declare currencySymbol: string;
  @Expose() declare status: IBoothStatus;
  @Expose() declare dateOpen?: Date | null;
  @Expose() declare dateClose?: Date | null;
  @Expose() declare datesOpenInFair?: Array<Date> | null;
  @Expose() declare fair?: IFairInfo;
  @Expose() declare infoImage?: IImageUploadInfo;
  @Expose() declare bannerImage?: IImageUploadInfo;

  @Exclude() ownerId = NaN;

  constructor(model: Booth) {
    const values = model.get();

    this.id = values.id;
    this.name = values.name;
    this.description = values.description;
    this.boothNumber = values.boothNumber;
    this.currencySymbol = values.currencySymbol;
    this.status = {
      status: values.status,
      reason: values.statusReason ?? undefined,
      contentPublished: values.statusContentPublished ?? false,
    };
    this.infoImage = model.infoImage?.toImageUploadInfo();
    this.bannerImage = model.bannerImage?.toImageUploadInfo();

    if(values.fairId) {
      this.fair = model.associatedFair?.toFairInfo();
      this.datesOpenInFair = values.datesOpenInFair as Array<Date> | null;
    } else {
      this.location = values.location;
      this.dateOpen = values.dateOpen;
      this.dateClose = values.dateClose;
    }
  }
}
