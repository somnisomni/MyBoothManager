import { IGoodsCombinationResponse } from "@myboothmanager/common";
import { PublicGoodsCombinationResponseDto } from "@/modules/public/goods-combination/dto/goods-combination.dto";

export class AdminGoodsCombinationResponseDto extends PublicGoodsCombinationResponseDto implements IGoodsCombinationResponse { }
