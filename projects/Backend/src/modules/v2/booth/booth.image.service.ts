import { UtilService } from "@/modules/common/util/util.service";
import { MultipartFile } from "@fastify/multipart";
import { IImageUploadInfo, ImageSizeConstraintKey, ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { BoothService } from "./booth.service";

@Injectable()
export class BoothImageService {
  constructor(
    @Inject(forwardRef(() => BoothService))
    private readonly booth: BoothService,
    private readonly util: UtilService,
  ) { }

  private readonly BANNER_IMAGE_PATH = "booth/banner";
  private readonly INFO_IMAGE_PATH   = "booth/info";

  async uploadBannerImage(id: number, file: MultipartFile, accountId: number): Promise<IImageUploadInfo> {
    return await this.util.processImageUpload(
      await this.booth.findOne(id, accountId),
      "bannerImageId",
      file,
      this.BANNER_IMAGE_PATH,
      ImageSizeConstraintKey.BOOTH_BANNER,
      accountId,
    );
  }

  async uploadInfoImage(id: number, file: MultipartFile, accountId: number): Promise<IImageUploadInfo> {
    return await this.util.processImageUpload(
      await this.booth.findOne(id, accountId),
      "infoImageId",
      file,
      this.INFO_IMAGE_PATH,
      ImageSizeConstraintKey.BOOTH_INFO,
      accountId,
    );
  }

  async deleteBannerImage(id: number, accountId: number): Promise<ISuccessResponse> {
    return await this.util.processImageDelete(
      await this.booth.findOne(id, accountId),
      "bannerImageId",
    );
  }

  async deleteInfoImage(id: number, accountId: number): Promise<ISuccessResponse> {
    return await this.util.processImageDelete(
      await this.booth.findOne(id, accountId),
      "infoImageId",
    );
  }

  async deleteAllImages(id: number, accountId: number): Promise<ISuccessResponse> {
    const results = [
      await this.deleteBannerImage(id, accountId),
      await this.deleteInfoImage(id, accountId),
    ];

    if(results.every((result) => result.success)) {
      return SUCCESS_RESPONSE;
    } else {
      throw new InternalServerErrorException("Failed to delete all images");
    }
  }
}
