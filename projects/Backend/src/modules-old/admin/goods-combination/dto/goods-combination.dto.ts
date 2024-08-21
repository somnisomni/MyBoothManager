import { IGoodsCombinationResponse, IGoodsStock } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import { PublicGoodsCombinationResponseDto } from "@/modules/public/goods-combination/dto/goods-combination.dto";
import GoodsCombination from "@/db/models/goods-combination";

@Exclude()
export class AdminGoodsCombinationResponseDto extends PublicGoodsCombinationResponseDto implements IGoodsCombinationResponse {
  @Expose() declare stock: Required<IGoodsStock>;

  constructor(model: GoodsCombination) {
    super(model);

    this.stock = {
      visibility: model.get("stockVisibility"),
      initial: model.get("stockInitial"),
      remaining: model.get("stockRemaining"),
    };
  }
}
