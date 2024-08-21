import { IBoothCreateRequest, SupportedCurrencyCodes } from "@myboothmanager/common";

export class CreateBoothRequestDto implements IBoothCreateRequest /* , IBoothCreateWithFairRequest */ {
  declare fairId?: number;
  declare name: string;
  declare description?: string;
  declare location: string;
  declare boothNumber?: string;
  declare currencySymbol: string;
  declare currencyCode: SupportedCurrencyCodes;
  declare dateOpen?: Date | null;
  declare dateClose?: Date | null;
  declare datesOpenInFair?: Array<string> | null;
}
