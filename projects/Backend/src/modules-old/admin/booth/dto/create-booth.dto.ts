import { IBoothCreateRequest, SupportedCurrencyCodes } from "@myboothmanager/common";

export class CreateBoothRequestDto implements IBoothCreateRequest {
  declare fairId?: number;
  declare name: string;
  declare description?: string;
  declare location: string;
  declare boothNumber?: string;
  declare currencySymbol: string;
  declare currencyCode: SupportedCurrencyCodes;
  declare dateOpen: Date;
  declare dateClose: Date;
}
