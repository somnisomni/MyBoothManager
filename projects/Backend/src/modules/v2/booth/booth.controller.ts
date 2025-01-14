import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { BoothService } from "./booth.service";
import { AdminBoothResponseDto, BoothResponseDto, SuperAdminBoothResponseDto } from "./dto/booth.dto";
import { AllowedFor, AuthData, UserType, UserTypes, UserTypeUtil } from "../auth/auth.guard";
import { IAuthData } from "../auth/jwt-util.service";
import { CreateBoothRequestDto } from "./dto/create.dto";
import { UpdateBoothRequestDto } from "./dto/update.dto";
import { ISuccessResponse, type IBoothStatus, type ISingleValueResponse } from "@myboothmanager/common";
import { UpdateBoothStatusRequestDto } from "./dto/update-status.dto";
import type { UpdateBoothNoticeRequestDto } from "@/modules/v2/booth/dto/update-notice.dto";

@Controller("/booth")
export class BoothController {
  constructor(
    private readonly booth: BoothService,
  ) { }

  /* === Multi user-type routes === */
  /**
   * Finds all booths
   *
   *  - for **super admin**: returns all booths with owner information
   *  - for **booth admin**: returns all booths owned by the user
   *  - for **public user**: returns all published booths, with limited information for each
   */
  @Get()
  async findAll(@UserType() userType: UserTypes,
                @AuthData() authData?: IAuthData): Promise<BoothResponseDto[]> {
    if(authData) {
      if(UserTypeUtil.havePermission(userType, UserTypes.SUPER_ADMIN)) {
        return (await this.booth.findAllSuperAdmin())
          .map(booth => new SuperAdminBoothResponseDto(booth));
      } else if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN) && authData.id >= 0) {
        return (await this.booth.findAll(false, authData.id))
          .map(booth => new AdminBoothResponseDto(booth));
      }
    }

    return (await this.booth.findAll(true))
      .map(booth => new BoothResponseDto(booth));
  }

  /**
   * Finds a booth by ID
   *
   *  - for **booth admin**: returns the booth if it belongs to the user
   *  - for **public user**: returns the booth if it is published
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number,
                @UserType() userType: UserTypes,
                @Query("setLast", new ParseBoolPipe({ optional: true })) setLast?: boolean,
                @AuthData() authData?: IAuthData): Promise<BoothResponseDto> {
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN) && authData) {
      return new AdminBoothResponseDto(await this.booth.findOne(id, false, authData.id, setLast));
    }

    return new BoothResponseDto(await this.booth.findOne(id, true));
  }


  /* === Public routes === */
  /**
   * Checks if a booth is publicly accessible
   */
  @Get(":id/public-access")
  async checkPublicAccess(@Param("id", ParseIntPipe) id: number): Promise<ISingleValueResponse<boolean>> {
    return { value: await this.booth.isBoothAvailable(id) };
  }


  /* === Booth admin routes === */
  /**
   * Creates a new booth
   */
  @Post()
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async create(@Body() createDto: CreateBoothRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminBoothResponseDto> {
    return new AdminBoothResponseDto(await this.booth.create(createDto, authData.id));
  }

  /**
   * Updates information of a booth
   */
  @Patch(":id")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async update(@Param("id", ParseIntPipe) id: number,
               @Body() updateDto: UpdateBoothRequestDto,
               @AuthData() authData: IAuthData): Promise<AdminBoothResponseDto> {
    return new AdminBoothResponseDto(await this.booth.update(id, updateDto, authData.id));
  }

  /**
   * Updates status of a booth
   */
  @Patch(":id/status")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async updateStatus(@Param("id", ParseIntPipe) id: number,
                     @Body() updateStatusDto: UpdateBoothStatusRequestDto,
                     @AuthData() authData: IAuthData): Promise<IBoothStatus> {
    return await this.booth.updateStatus(id, updateStatusDto, authData.id);
  }

  /**
   * Updates notice of a booth
   */
  @Patch(":id/notice")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async updateNotice(@Param("id", ParseIntPipe) id: number,
                     @Body() notice: UpdateBoothNoticeRequestDto,
                     @AuthData() authData: IAuthData): Promise<ISingleValueResponse<string>> {
    return await this.booth.updateNotice(id, notice, authData.id);
  }


  /* === Super admin routes === */
  /**
   * Deletes a booth
   */
  @Delete(":id")
  @AllowedFor(UserTypes.SUPER_ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number,
               @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.booth.remove(id, authData.id);
  }
}
