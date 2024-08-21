import { PartialType } from "@nestjs/mapped-types";
import { IGoodsUpdateRequest } from "@myboothmanager/common";
import { CreateGoodsRequestDto } from "./create-goods.dto";

export class UpdateGoodsRequestDto extends PartialType(CreateGoodsRequestDto) implements IGoodsUpdateRequest {
  declare boothId: number;
}
