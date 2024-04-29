import { IGoodsCategory, IGoodsCategoryResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GoodsCategoryResponseDto implements IGoodsCategoryResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;

  @Exclude() declare boothId: number;

  constructor(partial: Partial<IGoodsCategory>) {
    Object.assign(this, partial);
  }
}
