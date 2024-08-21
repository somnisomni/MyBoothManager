import { IBoothMemberResponse } from "@myboothmanager/common";
import { Exclude } from "class-transformer";
import { PublicBoothMemberResponseDto } from "@/modules/public/booth-member/dto/booth-member.dto";

@Exclude()
export class AdminBoothMemberResponseDto extends PublicBoothMemberResponseDto implements IBoothMemberResponse { }
