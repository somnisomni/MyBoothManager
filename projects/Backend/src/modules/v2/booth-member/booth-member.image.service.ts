import { UtilService } from "@/modules/common/util/util.service";
import { forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MultipartFile } from "@fastify/multipart";
import { IImageUploadInfo, ImageSizeConstraintKey, ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { BoothMemberService } from "./booth-member.service";

@Injectable()
export class BoothMemberImageService {
  constructor(
    @Inject(forwardRef(() => BoothMemberService))
    private readonly member: BoothMemberService,
    private readonly util: UtilService,
  ) { }

  private readonly AVATAR_IMAGE_PATH = "booth/member/avatar";

  async uploadAvatarImage(id: number, boothId: number, file: MultipartFile, accountId: number): Promise<IImageUploadInfo> {
    return await this.util.processImageUpload(
      await this.member.findOne(id, boothId, true, accountId),
      "avatarImageId",
      file,
      this.AVATAR_IMAGE_PATH,
      ImageSizeConstraintKey.BOOTH_MEMBER_AVATAR,
      accountId,
    );
  }

  async deleteAvatarImage(id: number, boothId: number, accountId: number): Promise<ISuccessResponse> {
    return await this.util.processImageDelete(
      await this.member.findOne(id, boothId, true, accountId),
      "avatarImageId",
    );
  }

  async deleteAllImages(id: number, boothId: number, accountId: number): Promise<ISuccessResponse> {
    const results = [
      await this.deleteAvatarImage(id, boothId, accountId),
    ];

    if(results.every((result) => result.success)) {
      return SUCCESS_RESPONSE;
    } else {
      throw new InternalServerErrorException("Failed to delete all images");
    }
  }
}
