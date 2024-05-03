import { IGoodsCategoryResponse } from "@myboothmanager/common";
import { PublicGoodsCategoryResponseDto } from "@/modules/public/goods-category/dto/goods-category.dto";

export class AdminGoodsCategoryResponseDto extends PublicGoodsCategoryResponseDto implements IGoodsCategoryResponse { }
