import { PartialType } from "@nestjs/mapped-types";
import { IGoodsCategoryUpdateRequest } from "@myboothmanager/common";
import { CreateGoodsCategoryRequestDto } from "./create-goods-category.dto";

export class UpdateGoodsCategoryRequestDto extends PartialType(CreateGoodsCategoryRequestDto) implements IGoodsCategoryUpdateRequest {
  declare boothId: number;
}
