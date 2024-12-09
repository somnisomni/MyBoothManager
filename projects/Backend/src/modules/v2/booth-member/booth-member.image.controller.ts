import { Controller, Delete, forwardRef, Inject, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { BoothMemberImageService } from "./booth-member.image.service";
import { UtilService } from "@/modules/common/util/util.service";
import { BOOTH_ID_QUERY } from "@/lib/const";
import { IImageUploadInfo, ISuccessResponse } from "@myboothmanager/common";
import { FastifyRequest } from "fastify";
import { AllowedFor, UserTypes, AuthData } from "../auth/auth.guard";
import { IAuthData } from "../auth/jwt-util.service";

@Controller(`/booth/:${BOOTH_ID_QUERY}/member/:mId/image`)
export class BoothMemberImageController {
  constructor(
    @Inject(forwardRef(() => BoothMemberImageService))
    private readonly image: BoothMemberImageService,
    private readonly util: UtilService,
  ) { }

  /* === Admin routes === */
  @Post("avatar")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async uploadPrimaryImage(@Param("mId", ParseIntPipe) id: number,
                           @Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                           @Req() request: FastifyRequest,
                           @AuthData() authData: IAuthData): Promise<IImageUploadInfo> {
    return await this.image.uploadAvatarImage(id, boothId, await this.util.getFileFromRequest(request), authData.id);
  }

  @Delete("avatar")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async deletePrimaryImage(@Param("mId", ParseIntPipe) id: number,
                           @Param(BOOTH_ID_QUERY, ParseIntPipe) boothId: number,
                           @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.image.deleteAvatarImage(id, boothId, authData.id);
  }
}
