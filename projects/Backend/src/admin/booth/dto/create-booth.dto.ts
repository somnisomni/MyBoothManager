import { IBoothCreateRequest } from "@myboothmanager/common";

export class CreateBoothDTO implements IBoothCreateRequest {
  name!: string;
  description?: string;
  location!: string;
  currencySymbol!: string;
}
