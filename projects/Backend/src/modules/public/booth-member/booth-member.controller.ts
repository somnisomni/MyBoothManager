import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicBoothMemberService } from "./booth-member.service";
import { PublicBoothMemberResponseDto } from "./dto/booth-member.dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/public/booth/:bId/member")
export class PublicBoothMemberController {
  constructor(private readonly publicBoothMemberService: PublicBoothMemberService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Param("bId") boothId: string): Promise<Array<PublicBoothMemberResponseDto>> {
    return (await this.publicBoothMemberService.findAll(+boothId))
      .map((member) => new PublicBoothMemberResponseDto(member));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("bId") boothId: string, @Param("id") id: string): Promise<PublicBoothMemberResponseDto> {
    return new PublicBoothMemberResponseDto((await this.publicBoothMemberService.findOne(+boothId, +id)));
  }
}
