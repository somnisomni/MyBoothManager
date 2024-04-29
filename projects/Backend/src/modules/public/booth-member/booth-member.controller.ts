import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicBoothMemberService } from "./booth-member.service";
import { BoothMemberResponseDto } from "./dto/booth-member.dto";

@Controller("/public/booth/:bId/member")
export class PublicBoothMemberController {
  constructor(private readonly publicBoothMemberService: PublicBoothMemberService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Param("bId") boothId: string): Promise<Array<BoothMemberResponseDto>> {
    return (await this.publicBoothMemberService.findAll(+boothId))
      .map((member) => new BoothMemberResponseDto(member.get()));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("bId") boothId: string, @Param("id") id: string): Promise<BoothMemberResponseDto> {
    return new BoothMemberResponseDto((await this.publicBoothMemberService.findOne(+boothId, +id)).get());
  }
}
