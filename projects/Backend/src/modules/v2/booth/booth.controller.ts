import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { BoothService } from "./booth.service";
import { AdminBoothResponseDto, BoothResponseDto } from "./dto/booth.dto";
import { AllowedFor, AuthData, UserType, UserTypes, UserTypeUtil } from "../auth/auth.guard";
import { IAuthData } from "../auth/jwt-util.service";
import { CreateBoothRequestDto } from "./dto/create.dto";
import { UpdateBoothRequestDto } from "./dto/update.dto";
import { ISuccessResponse, type IBoothStatus } from "@myboothmanager/common";
import { UpdateBoothStatusRequestDto } from "./dto/update-status.dto";

@Controller("/booth")
export class BoothController {
  constructor(
    private readonly booth: BoothService,
  ) { }

  /* === Multi user-type routes === */
  /**
   * Finds all booths
   *
   *  - for **booth admin**: returns all booths owned by the user
   *  - for **public user**: returns all published booths, with limited information for each
   */
  @Get()
  async findAll(@UserType() userType: UserTypes,
                @AuthData() authData?: IAuthData): Promise<BoothResponseDto[]> {
    if(UserTypeUtil.havePermission(userType, UserTypes.BOOTH_ADMIN) && authData) {
      return (await this.booth.findAll(false, authData.id))
        .map(booth => new AdminBoothResponseDto(booth));
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
