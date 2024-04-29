import { GoodsStockVisibility, IGoodsCombinationModel, IGoodsCombinationResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GoodsCombinationResponseDto implements IGoodsCombinationResponse {
  @Expose() declare id: number;
  @Expose() declare categoryId?: number | null;
  @Expose() declare name: string;
  @Expose() declare description?: string;
  @Expose() declare price: number;
  @Expose() declare stockInitial: number;
  @Expose() declare stockRemaining: number;
  @Expose() declare stockVisibility: GoodsStockVisibility;
  @Expose() declare ownerMembersId?: number[];
  @Expose() declare combinationImageUrl?: string;

  @Exclude() declare boothId: number;

  constructor(partial: Partial<IGoodsCombinationModel>) {
    Object.assign(this, partial);
  }
}
