import { IBoothCreateRequest } from "@myboothmanager/common";

export class CreateBoothRequestDto implements IBoothCreateRequest {
  declare name: string;
  declare description?: string;
  declare location: string;
  declare boothNumber?: string;
  declare currencySymbol: string;
  declare dateOpen: Date;
  declare dateClose: Date;
}
