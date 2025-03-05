import type { IGoodsCategoryUpdateRequest } from "@myboothmanager/common";
import { PartialType } from "@nestjs/mapped-types";
import { CreateGoodsCategoryRequestDto } from "./create.dto";

export class UpdateGoodsCategoryRequestDto extends PartialType(CreateGoodsCategoryRequestDto) implements IGoodsCategoryUpdateRequest {
  declare boothId: number;
}
