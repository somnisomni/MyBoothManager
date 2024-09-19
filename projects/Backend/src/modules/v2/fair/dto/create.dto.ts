import { IFairCreateRequest } from "@myboothmanager/common";

export class CreateFairRequestDto implements IFairCreateRequest {
  declare name: string;
  declare description?: string | null;
  declare location: string;
  declare openingDates: Date[];
  declare websiteUrl?: string | null;
}
