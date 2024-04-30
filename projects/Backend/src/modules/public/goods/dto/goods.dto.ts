import { GoodsStatus, GoodsStockVisibility, IGoodsModel, IGoodsResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GoodsResponseDto implements IGoodsResponse {
  @Expose() declare id: number;
  @Expose() declare categoryId?: number | null;
  @Expose() declare combinationId?: number | null;
  @Expose() declare name: string;
  @Expose() declare description?: string;
  @Expose() declare type?: string;
  @Expose() declare price: number;
  @Expose() declare stockInitial: number;
  @Expose() declare stockRemaining: number;
  @Expose() declare stockVisibility: GoodsStockVisibility;
  @Expose() declare status: GoodsStatus;
  @Expose() declare statusReason?: string | null;
  @Expose() declare ownerMembersId?: number[];
  @Expose() declare goodsImageUrl?: string | null;
  @Expose() declare goodsImageThumbnailData?: string | null;

  @Exclude() declare boothId: number;

  constructor(partial: Partial<IGoodsModel>) {
    Object.assign(this, partial);
  }
}
