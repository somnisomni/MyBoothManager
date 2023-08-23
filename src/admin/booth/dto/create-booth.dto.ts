import { IBooth } from "myboothmanager-common/interfaces";

export class CreateBoothDTO implements Partial<IBooth> {
  name!: string;
  description?: string;
  location!: string;
  currencySymbol!: string;
}
