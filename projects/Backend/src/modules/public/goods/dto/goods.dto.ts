import { GoodsStatus, GoodsStockVisibility, IGoodsResponse } from "@myboothmanager/common";

export class GoodsResponseDto implements IGoodsResponse {
  declare id: number;
  declare boothId: number;
  declare categoryId?: number | null;
  declare combinationId?: number | null;
  declare description?: string;
  declare goodsImageUrl?: string;
  declare name: string;
  declare ownerMembersId?: number[];
  declare price: number;
  declare status: GoodsStatus;
  declare statusReason?: string | null;
  declare stockInitial: number;
  declare stockRemaining: number;
  declare stockVisibility: GoodsStockVisibility;
  declare type?: string;
}
