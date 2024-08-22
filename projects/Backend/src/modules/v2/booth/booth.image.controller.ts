import { Controller, Delete, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { IImageUploadInfo, ISuccessResponse } from "@myboothmanager/common";
import { AllowedFor, AuthData, UserTypes } from "../auth/auth.guard";
import { IAuthData } from "../auth/jwt-util.service";
import { FastifyRequest } from "fastify";
import { UtilService } from "@/modules/common/util/util.service";
import { BoothImageService } from "./booth.image.service";

@Controller("/booth/:id/image")
export class BoothImageController {
  constructor(
    private readonly image: BoothImageService,
    private readonly util: UtilService,
  ) { }

  /* === Admin routes === */
  @Post("banner")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async uploadBannerImage(@Param("id", new ParseIntPipe()) id: number,
                          @Req() request: FastifyRequest,
                          @AuthData() authData: IAuthData): Promise<IImageUploadInfo> {
    return await this.image.uploadBannerImage(id, await this.util.getFileFromRequest(request), authData.id);
  }

  @Delete("banner")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async deleteBannerImage(@Param("id", new ParseIntPipe()) id: number,
                          @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.image.deleteBannerImage(id, authData.id);
  }

  @Post("info")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async uploadInfoImage(@Param("id", new ParseIntPipe()) id: number,
                        @Req() request: FastifyRequest,
                        @AuthData() authData: IAuthData): Promise<IImageUploadInfo> {
    return await this.image.uploadInfoImage(id, await this.util.getFileFromRequest(request), authData.id);
  }

  @Delete("info")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async deleteInfoImage(@Param("id", new ParseIntPipe()) id: number,
                        @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.image.deleteInfoImage(id, authData.id);
  }
}
