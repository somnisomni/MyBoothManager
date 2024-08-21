import { IBoothRelatedLink, IBoothResponse, IBoothStatus, IFairInfo, IImageUploadInfo, SupportedCurrencyCodes } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import Booth from "@/db/models/booth";

@Exclude()
export class PublicBoothResponseDto implements IBoothResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;
  @Expose() declare description?: string | null;
  @Expose() declare location?: string | null;
  @Expose() declare noticeContent?: string | null;
  @Expose() declare boothNumber?: string | null;
  @Expose() declare currencySymbol: string;
  @Expose() declare currencyCode: SupportedCurrencyCodes;
  @Expose() declare status: IBoothStatus;
  @Expose() declare dateOpen?: Date | null;
  @Expose() declare dateClose?: Date | null;
  @Expose() declare datesOpenInFair?: Array<Date> | null;
  @Expose() declare relatedLinks: Array<IBoothRelatedLink>;
  @Expose() declare fair?: IFairInfo;
  @Expose() declare infoImage?: IImageUploadInfo;
  @Expose() declare bannerImage?: IImageUploadInfo;

  @Exclude() ownerId = NaN;

  constructor(model: Booth) {
    const values = model.get();

    this.id = values.id;
    this.name = values.name;
    this.description = values.description;
    this.noticeContent = values.noticeContent;
    this.boothNumber = values.boothNumber;
    this.currencySymbol = values.currencySymbol;
    this.currencyCode = values.currencyCode;
    this.status = {
      status: values.status,
      reason: values.statusReason ?? undefined,
      contentPublished: values.statusContentPublished ?? false,
    };
    this.relatedLinks = values.relatedLinks ?? [];
    this.infoImage = model.infoImage?.toImageUploadInfo();
    this.bannerImage = model.bannerImage?.toImageUploadInfo();

    if(values.fairId) {
      this.fair = model.associatedFair?.toFairInfo();
      this.location = model.associatedFair?.location;
      this.datesOpenInFair = values.datesOpenInFair as Array<Date> | null;
    } else {
      this.location = values.location;
      this.dateOpen = values.dateOpen;
      this.dateClose = values.dateClose;
    }
  }
}
