import { GoodsStockVisibility, IGoodsCreateRequest } from "@myboothmanager/common";

export class CreateGoodsDTO implements IGoodsCreateRequest {
  declare boothId: number;
  declare categoryId?: number;
  declare name: string;
  declare description?: string;
  declare type?: string;
  declare price: number;
  declare stockInitial: number;
  declare stockRemaining: number;
  declare stockVisibility: GoodsStockVisibility;
}
