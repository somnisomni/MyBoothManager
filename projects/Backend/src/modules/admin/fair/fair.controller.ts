import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { PublicFairService } from "@/modules/public/fair/fair.service";
import { AdminAuthGuard, SuperAdmin } from "../auth/auth.guard";
import { FairService } from "./fair.service";
import { SuperAdminFairResponseDto } from "./dto/fair.dto";
import { CreateFairRequestDto } from "./dto/create-fair.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/fair")
export class FairController {
  constructor(
    private readonly publicFairService: PublicFairService,
    private readonly adminFairService: FairService,
  ) {}

  /* SuperAdmin routes */
  @SuperAdmin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("all")
  async findAllIncludePassed(): Promise<Array<SuperAdminFairResponseDto>> {
    return (await this.publicFairService.findAll(true))
      .map((fair) => new SuperAdminFairResponseDto(fair));
  }

  @SuperAdmin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() dto: CreateFairRequestDto): Promise<SuperAdminFairResponseDto> {
    return new SuperAdminFairResponseDto(await this.adminFairService.create(dto));
  }

  @SuperAdmin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.adminFairService.remove(+id);
  }
}
