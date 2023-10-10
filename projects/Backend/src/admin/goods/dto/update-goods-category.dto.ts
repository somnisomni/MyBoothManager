import { PartialType } from "@nestjs/mapped-types";
import { IGoodsCategoryUpdateRequest } from "@myboothmanager/common";
import { CreateGoodsCategoryDTO } from "./create-goods-category.dto";

export class UpdateGoodsCategoryDTO extends PartialType(CreateGoodsCategoryDTO) implements IGoodsCategoryUpdateRequest {
  declare boothId: number;
}
