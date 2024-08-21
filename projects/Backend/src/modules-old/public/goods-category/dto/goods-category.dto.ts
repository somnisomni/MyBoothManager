import { IGoodsCategoryResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import GoodsCategory from "@/db/models/goods-category";

@Exclude()
export class PublicGoodsCategoryResponseDto implements IGoodsCategoryResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;

  @Exclude() boothId = NaN;

  constructor(model: GoodsCategory) {
    const values = model.get();

    this.id = values.id;
    this.name = values.name;
  }
}
