import { GoodsWithoutAllStockInfoOmitKey } from "@myboothmanager/common";
import { OmitType } from "@nestjs/mapped-types";
import { GoodsResponseDto } from "./goods.dto";

export class GoodsWithoutAllStockInfoDto extends OmitType(GoodsResponseDto, GoodsWithoutAllStockInfoOmitKey) { }
