import { Controller, Delete, Param, ParseIntPipe, Post, Query, Req } from "@nestjs/common";
import { GoodsImageService } from "./goods.image.service";
import { UtilService } from "@/modules/common/util/util.service";
import { BOOTH_ID_QUERY } from "@/lib/const";
import { IImageUploadInfo, ISuccessResponse } from "@myboothmanager/common";
import { FastifyRequest } from "fastify";
import { AllowedFor, UserTypes, AuthData } from "../auth/auth.guard";
import { IAuthData } from "../auth/jwt-util.service";

@Controller("/goods/:id/image")
export class GoodsImageController {
  constructor(
    private readonly image: GoodsImageService,
    private readonly util: UtilService,
  ) { }

  /* === Admin routes === */
  @Post("primary")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async uploadPrimaryImage(@Param("id", ParseIntPipe) id: number,
                           @Query(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                           @Req() request: FastifyRequest,
                           @AuthData() authData: IAuthData): Promise<IImageUploadInfo> {
    return await this.image.uploadPrimaryImage(id, boothId, await this.util.getFileFromRequest(request), authData.id);
  }

  @Delete("primary")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async deletePrimaryImage(@Param("id", ParseIntPipe) id: number,
                           @Query(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                           @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.image.deletePrimaryImage(id, boothId, authData.id);
  }
}
