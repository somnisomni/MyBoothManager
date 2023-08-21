import { PartialType } from "@nestjs/mapped-types";
import { CreateGoodsCategoryDTO } from "./create-goods-category.dto";

export class UpdateGoodsCategoryDTO extends PartialType(CreateGoodsCategoryDTO) {}
