import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { BOOTH_ID_QUERY } from "@/lib/const";
import { BoothMemberService } from "./booth-member.service";
import { AdminBoothMemberResponseDto, BoothMemberResponseDto } from "./dto/booth-member.dto";
import { UserType, UserTypes, AuthData, UserTypeUtil, AllowedFor } from "../auth/auth.guard";
import type { IAuthData } from "../auth/jwt-util.service";
import type { CreateBoothMemberRequestDto } from "./dto/create.dto";
import type { ISuccessResponse } from "@myboothmanager/common";

@Controller(`/booth/:${BOOTH_ID_QUERY}/member`)
export class BoothMemberController {
  constructor(
    private readonly member: BoothMemberService,
  ) { }

  /* === Multi user-type routes === */
  /**
   * Finds all booth members
   *
   *  - for **booth admin**: returns all booth members belonging to the booth
   *  - for **public user**: returns all booth members belonging to the booth, with limited information for each
   */
  @Get()
  async findAll(@Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                @UserType() userType: UserTypes,
                @AuthData() authData?: IAuthData): Promise<BoothMemberResponseDto[]> {
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN) && authData) {
      return (await this.member.findAll(boothId, true, authData.id))
        .map(member => new AdminBoothMemberResponseDto(member));
    }

    return (await this.member.findAll(boothId))
      .map(member => new BoothMemberResponseDto(member));
  }

  /**
   * Finds a booth member by ID (PK)
   *
   *  - for **booth admin**: returns a booth member belonging to the booth
   *  - for **public user**: returns a booth member belonging to the booth, with limited information for each
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number,
                @Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                @UserType() userType: UserTypes,
                @AuthData() authData?: IAuthData): Promise<BoothMemberResponseDto> {
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN)) {
      return new AdminBoothMemberResponseDto(await this.member.findOne(id, boothId, true, authData!.id));
    }

    return new BoothMemberResponseDto(await this.member.findOne(id, boothId));
  }

  /* === Booth admin routes === */
  /**
   * Creates a new booth member
   */
  @Post()
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async create(@Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
               @Body() createDto: CreateBoothMemberRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminBoothMemberResponseDto> {
    return new AdminBoothMemberResponseDto(await this.member.create({ ...createDto, boothId }, authData.id));
  }

  /**
   * Updates information of a booth member
   */
  @Patch(":id")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async update(@Param("id", ParseIntPipe) id: number,
               @Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
               @Body() updateDto: CreateBoothMemberRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminBoothMemberResponseDto> {
    return new AdminBoothMemberResponseDto(await this.member.update(id, { ...updateDto, boothId }, authData.id));
  }

  /**
   * Deletes a booth member
   */
  @Delete(":id")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async remove(@Param("id", ParseIntPipe) id: number,
               @Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
               @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.member.remove(id, boothId, authData.id);
  }
}
