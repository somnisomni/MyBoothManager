import { IGoodsCombinationCreateRequest, GoodsStockVisibility } from "@myboothmanager/common";

export class CreateGoodsCombinationRequestDto implements IGoodsCombinationCreateRequest {
  declare boothId: number;
  declare categoryId?: number | null;
  declare name: string;
  declare description?: string;
  declare price: number;
  declare goodsIds: number[];
  declare stockVisibility: GoodsStockVisibility;
}
