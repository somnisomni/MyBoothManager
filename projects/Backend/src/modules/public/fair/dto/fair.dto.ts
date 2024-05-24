import { IFairResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import Fair from "@/db/models/fair";

@Exclude()
export class PublicFairResponseDto implements IFairResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;
  @Expose() declare location: string;
  @Expose() declare description?: string | null;
  @Expose() declare openingDates: Array<Date>;
  @Expose() declare websiteUrl?: string | null;

  constructor(model: Fair) {
    const values = model.get();

    this.id = values.id;
    this.name = values.name;
    this.location = values.location;
    this.description = values.description;
    this.openingDates = values.openingDates as unknown as Array<Date>;
    this.websiteUrl = values.websiteUrl;
  }
}
