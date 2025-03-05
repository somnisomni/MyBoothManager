import type { IGoodsUpdateRequest } from "@myboothmanager/common";
import { PartialType } from "@nestjs/mapped-types";
import { CreateGoodsRequestDto } from "./create.dto";

export class UpdateGoodsRequestDto extends PartialType(CreateGoodsRequestDto) implements IGoodsUpdateRequest {
  declare boothId: number;
}
