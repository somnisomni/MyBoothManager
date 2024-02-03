import { PartialType } from "@nestjs/mapped-types";
import { GoodsStatus, IGoodsUpdateRequest } from "@myboothmanager/common";
import { CreateGoodsDTO } from "./create-goods.dto";

export class UpdateGoodsDTO extends PartialType(CreateGoodsDTO) implements IGoodsUpdateRequest {
  declare boothId: number;
  declare status?: GoodsStatus;
  declare statusReason?: string;
}
