import { Body, Controller, Delete, Get, NotAcceptableException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ISuccessResponse } from "@myboothmanager/common";
import { AllowedFor, UserType, UserTypes, UserTypeUtil } from "../auth/auth.guard";
import { FairService } from "./fair.service";
import { FairResponseDto, SuperAdminFairResponseDto } from "./dto/fair.dto";
import { CreateFairRequestDto } from "./dto/create.dto";

@Controller("/fair")
export class FairController {
  constructor(
    private readonly fair: FairService,
  ) { }

  /* === Multi user-type routes === */
  /**
   * Finds all fairs
   *
   *  - for **super admin**: returns all fairs including passed ones with extra information
   *  - for **public user**: returns all available fairs (excluding passed ones)
   */
  @Get()
  async findAll(@UserType() userType: UserTypes): Promise<FairResponseDto[]> {
    if(UserTypeUtil.havePermission(userType, UserTypes.SUPER_ADMIN)) {
      return (await this.fair.findAll(true))
        .map(fair => new SuperAdminFairResponseDto(fair));
    }

    return (await this.fair.findAll())
      .map((fair) => new FairResponseDto(fair));
  }

  /**
   * Finds a fair by ID
   *
   *  - for **super admin**: returns the fair with extra information, regardless of the passed status
   *  - for **public user**: returns the fair only if it's not passed
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number,
                @UserType() userType: UserTypes): Promise<FairResponseDto> {
    if(UserTypeUtil.havePermission(userType, UserTypes.SUPER_ADMIN)) {
      return new SuperAdminFairResponseDto(await this.fair.findOne(id, true));
    }

    return new FairResponseDto(await this.fair.findOne(id));
  }


  /* === Super admin routes === */
  /**
   * Creates a new fair
   */
  @Post()
  @AllowedFor(UserTypes.SUPER_ADMIN)
  async create(@Body() dto: CreateFairRequestDto): Promise<SuperAdminFairResponseDto> {
    return new SuperAdminFairResponseDto(await this.fair.create(dto));
  }

  /**
   * Updates information of a fair
   */
  @Patch(":id")
  @AllowedFor(UserTypes.SUPER_ADMIN)
  async update(@Param("id", ParseIntPipe) id: number,
               @Body() dto: CreateFairRequestDto): Promise<SuperAdminFairResponseDto> {
    return new SuperAdminFairResponseDto(await this.fair.update(id, dto));
  }

  /**
   * Removes a fair
   */
  @Delete(":id")
  @AllowedFor(UserTypes.SUPER_ADMIN)
  async remove(@Param("id", ParseIntPipe) id: number): Promise<ISuccessResponse> {
    throw new NotAcceptableException("Removing fairs is prohibited for now.");

    return await this.fair.remove(id);
  }
}
