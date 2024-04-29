import { GoodsWithoutInitialStockInfoOmitKey } from "@myboothmanager/common";
import { OmitType } from "@nestjs/mapped-types";
import { GoodsResponseDto } from "./goods.dto";

export class GoodsWithoutInitialStockInfoDto extends OmitType(GoodsResponseDto, GoodsWithoutInitialStockInfoOmitKey) { }
