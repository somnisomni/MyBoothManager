import type { GoodsCombinationImageService } from "./goods-combination.image.service";
import type { IAuthData } from "../auth/jwt-util.service";
import type { UtilService } from "@/modules/common/util/util.service";
import type { IImageUploadInfo, ISuccessResponse } from "@myboothmanager/common";
import type { FastifyRequest } from "fastify";
import { Controller, Delete, Param, ParseIntPipe, Post, Query, Req } from "@nestjs/common";
import { BOOTH_ID_QUERY } from "@/lib/const";
import { AllowedFor, UserTypes, AuthData } from "../auth/auth.guard";

@Controller("/goods/combination/:id/image")
export class GoodsCombinationImageController {
  constructor(
    private readonly image: GoodsCombinationImageService,
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
