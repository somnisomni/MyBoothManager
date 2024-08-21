import { IGoodsAdminResponse, IGoodsStock } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import { PublicGoodsResponseDto } from "@/modules/public/goods/dto/goods.dto";
import Goods from "@/db/models/goods";

@Exclude()
export class AdminGoodsResponseDto extends PublicGoodsResponseDto implements IGoodsAdminResponse {
  @Expose() declare stock: Required<IGoodsStock>;

  constructor(model: Goods) {
    super(model);

    this.stock = {
      visibility: model.get("stockVisibility"),
      initial: model.get("stockInitial"),
      remaining: model.get("stockRemaining"),
    };
  }
}
