import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicFairService } from "./fair.service";
import { PublicFairResponseDto } from "./dto/fair.dto";

@Controller("/public/fair")
export class PublicFairController {
  constructor(private readonly publicFairService: PublicFairService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<Array<PublicFairResponseDto>> {
    return (await this.publicFairService.findAll())
      .map((fair) => new PublicFairResponseDto(fair));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<PublicFairResponseDto> {
    return new PublicFairResponseDto(await this.publicFairService.findOne(+id));
  }
}
