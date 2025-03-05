import type { IGoodsCategoryCreateRequest } from "@myboothmanager/common";

export class CreateGoodsCategoryRequestDto implements IGoodsCategoryCreateRequest {
  declare boothId: number;
  declare name: string;
}
