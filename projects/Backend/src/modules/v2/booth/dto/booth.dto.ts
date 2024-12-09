import type Booth from "@/db/models/booth";
import { BoothStatus, IBoothAdminResponse, IBoothExpense, IBoothRelatedLink, IBoothResponse, IBoothStatus, IFairInfo, IImageUploadInfo, SupportedCurrencyCodes } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class BoothResponseDto implements IBoothResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;
  @Expose() declare description?: string | null;
  @Expose() declare location?: string | null;
  @Expose() declare noticeContent?: string | null;
  @Expose() declare boothNumber?: string | null;
  @Expose() declare currencyCode: SupportedCurrencyCodes;
  @Expose() declare status: IBoothStatus;
  @Expose() declare dateOpen?: Date | null;
  @Expose() declare dateClose?: Date | null;
  @Expose() declare datesOpenInFair?: Array<Date> | null;
  @Expose() declare relatedLinks: Array<IBoothRelatedLink>;
  @Expose() declare fair?: IFairInfo;
  @Expose() declare infoImage?: IImageUploadInfo;
  @Expose() declare bannerImage?: IImageUploadInfo;

  @Exclude() ownerId: number = NaN;

  constructor(model: Booth) {
    const values = model.get();

    this.id = values.id;
    this.name = values.name;
    this.description = values.description;
    this.noticeContent = values.noticeContent;
    this.boothNumber = values.boothNumber;
    this.currencyCode = values.currencyCode;
    this.status = {
      status: values.status,
      // `reason` is available only when status is `PAUSE`
      reason: values.status === BoothStatus.PAUSE ? (values.statusReason ?? undefined) : undefined,
      // `contentPublished` is available only when status is `PREPARE` or `CLOSE`
      contentPublished: (values.status === BoothStatus.PREPARE || values.status === BoothStatus.CLOSE) ? (values.statusContentPublished ?? false) : undefined,
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

@Exclude()
export class AdminBoothResponseDto extends BoothResponseDto implements IBoothAdminResponse {
  @Expose() declare expenses: Array<IBoothExpense>;

  constructor(model: Booth) {
    super(model);

    this.expenses = model.get("expenses");
  }
}
