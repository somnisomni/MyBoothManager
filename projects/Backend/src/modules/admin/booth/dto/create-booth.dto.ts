import { IBoothCreateRequest } from "@myboothmanager/common";

export class CreateBoothDTO implements IBoothCreateRequest {
  name!: string;
  description?: string;
  location!: string;
  boothNumber?: string;
  currencySymbol!: string;
  dateOpen!: Date;
  dateClose!: Date;
}
