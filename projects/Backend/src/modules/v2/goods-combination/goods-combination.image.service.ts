import { UtilService } from "@/modules/common/util/util.service";
import { forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { GoodsCombinationService } from "./goods-combination.service";
import { MultipartFile } from "@fastify/multipart";
import { IImageUploadInfo, ImageSizeConstraintKey, ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";

@Injectable()
export class GoodsCombinationImageService {
  constructor(
    @Inject(forwardRef(() => GoodsCombinationService))
    private readonly combination: GoodsCombinationService,
    private readonly util: UtilService,
  ) { }

  private readonly PRIMARY_IMAGE_PATH = "goods-combination/primary";

  async uploadPrimaryImage(id: number, boothId: number, file: MultipartFile, accountId: number): Promise<IImageUploadInfo> {
    return await this.util.processImageUpload(
      await this.combination.findOne(id, boothId, true, accountId),
      "goodsImageId",
      file,
      this.PRIMARY_IMAGE_PATH,
      ImageSizeConstraintKey.GOODS,
      accountId,
    );
  }

  async deletePrimaryImage(id: number, boothId: number, accountId: number): Promise<ISuccessResponse> {
    return await this.util.processImageDelete(
      await this.combination.findOne(id, boothId, true, accountId),
      "goodsImageId",
    );
  }

  async deleteAllImages(id: number, boothId: number, accountId: number): Promise<ISuccessResponse> {
    const results = [
      await this.deletePrimaryImage(id, boothId, accountId),
    ];

    if(results.every((result) => result.success)) {
      return SUCCESS_RESPONSE;
    } else {
      throw new InternalServerErrorException("Failed to delete all images");
    }
  }
}