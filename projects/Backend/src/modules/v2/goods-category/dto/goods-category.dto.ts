import type GoodsCategory from "@/db/models/goods-category";
import type { IGoodsCategoryResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GoodsCategoryResponseDto implements IGoodsCategoryResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;

  @Exclude() boothId = NaN;

  constructor(model: GoodsCategory) {
    const values = model.get();

    this.id = values.id;
    this.name = values.name;
  }
}

export class AdminGoodsCategoryResponseDto extends GoodsCategoryResponseDto implements IGoodsCategoryResponse { }
