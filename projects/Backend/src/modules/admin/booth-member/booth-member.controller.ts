import type { FastifyRequest } from "fastify";
import { Controller, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { AuthData, AdminAuthGuard } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { UtilService } from "../util/util.service";
import { CreateBoothMemberRequestDto } from "./dto/create-booth-member.dto";
import { UpdateBoothMemberRequestDto } from "./dto/update-booth-member.dto";
import { BoothMemberService } from "./booth-member.service";
import { AdminBoothMemberResponseDto } from "./dto/booth-member.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/booth/:bId/member")
export class BoothMemberController {
  constructor(
    private readonly boothMemberService: BoothMemberService,
    private readonly utilService: UtilService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Param("bId") boothId: string, @Body() createBoothMemberDTO: CreateBoothMemberRequestDto, @AuthData() authData: IAuthPayload): Promise<AdminBoothMemberResponseDto> {
    return new AdminBoothMemberResponseDto(await this.boothMemberService.create(+boothId, createBoothMemberDTO, +authData.id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(@Param("bId") boothId: string, @Param("id") id: string, @Body() updateBoothMemberDTO: UpdateBoothMemberRequestDto, @AuthData() authData: IAuthPayload): Promise<AdminBoothMemberResponseDto> {
    return new AdminBoothMemberResponseDto(await this.boothMemberService.update(+boothId, +id, updateBoothMemberDTO, +authData.id));
  }

  @Delete(":id")
  async remove(@Param("bId") boothId: string, @Param("id") id: string, @AuthData() authData: IAuthPayload) {
    return await this.boothMemberService.remove(+boothId, +id, +authData.id);
  }

  @Post(":id/image")
  async uploadMemberImage(@Param("bId") boothId: string, @Param("id") id: string, @Req() req: FastifyRequest, @AuthData() authData: IAuthPayload) {
    return await this.boothMemberService.uploadMemberImage(+boothId, +id, await this.utilService.getFileFromRequest(req), +authData.id);
  }

  @Delete(":id/image")
  async deleteMemberImage(@Param("bId") boothId: string, @Param("id") id: string, @AuthData() authData: IAuthPayload) {
    return await this.boothMemberService.deleteMemberImage(+boothId, +id, +authData.id);
  }
}
