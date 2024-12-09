import { PartialType } from "@nestjs/mapped-types";
import { IGoodsCombinationUpdateRequest } from "@myboothmanager/common";
import { CreateGoodsCombinationRequestDto } from "./create.dto";

export class UpdateGoodsCombinationRequestDto extends PartialType(CreateGoodsCombinationRequestDto) implements IGoodsCombinationUpdateRequest {
  declare boothId: number;
}
