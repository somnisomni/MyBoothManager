export class CreateBoothDTO {
  name!: string;
  description: string | null = null;
  currencySymbol!: string;
  status: string = "prepare";
}
