import { PartialType } from "@nestjs/mapped-types";
import { GoodsStockVisibility, IGoodsCombinationUpdateRequest } from "@myboothmanager/common";
import { CreateGoodsCombinationDTO } from "./create-goods-combination.dto";

export class UpdateGoodsCombinationDTO extends PartialType(CreateGoodsCombinationDTO) implements IGoodsCombinationUpdateRequest {
  declare boothId: number;
  declare stockVisibility?: GoodsStockVisibility;
}
