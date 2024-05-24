import { IFairResponse } from "@myboothmanager/common";
import { PublicFairResponseDto } from "@/modules/public/fair/dto/fair.dto";

export class AdminFairResponseDto extends PublicFairResponseDto implements IFairResponse { }
