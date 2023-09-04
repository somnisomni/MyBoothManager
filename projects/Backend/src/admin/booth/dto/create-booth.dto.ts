import { IBooth } from "@myboothmanager/common";

export class CreateBoothDTO implements Partial<IBooth> {
  name!: string;
  description?: string;
  location!: string;
  currencySymbol!: string;
}
