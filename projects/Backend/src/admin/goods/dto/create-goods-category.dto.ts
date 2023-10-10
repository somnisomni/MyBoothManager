import { IGoodsCategoryCreateRequest } from "@myboothmanager/common";

export class CreateGoodsCategoryDTO implements IGoodsCategoryCreateRequest {
  boothId!: number;
  name!: string;
}
