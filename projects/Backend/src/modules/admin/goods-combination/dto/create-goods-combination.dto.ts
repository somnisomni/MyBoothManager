import { IGoodsCombinationCreateRequest } from "@myboothmanager/common";

export class CreateGoodsCombinationDTO implements IGoodsCombinationCreateRequest {
  declare boothId: number;
  declare categoryId?: number | null;
  declare name: string;
  declare description?: string;
  declare price: number;
  declare goodsIds: number[];
}