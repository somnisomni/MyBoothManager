import type { MultipartFile } from "@fastify/multipart";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ISuccessResponse, IUploadStorage, IValueResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import Booth from "@/db/models/booth";
import { create, findOneByPk, generateUploadFileName, removeTarget } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import UploadStorage from "@/db/models/uploadstorage";
import GoodsCombination from "@/db/models/goods-combination";
import Goods from "@/db/models/goods";
import { UtilService } from "../util/util.service";
import { UpdateGoodsCombinationDTO } from "./dto/update-goods-combination.dto";
import { CreateGoodsCombinationDTO } from "./dto/create-goods-combination.dto";
import { GoodsCombinationInfoUpdateFailedException, GoodsCombinationParentBoothNotFoundException } from "./goods-combination.exception";

@Injectable()
export class GoodsCombinationService {
  constructor(
    private readonly utilService: UtilService) { }

  private async getGoodsCombinationAndParentBooth(combinationId: number, boothId: number, callerAccountId: number): Promise<{ combination: GoodsCombination, booth: Booth }> {
    const combination = await findOneByPk(GoodsCombination, combinationId);
    if(!combination) throw new EntityNotFoundException();
    if(combination.boothId !== boothId) throw new NoAccessException();

    /*
    // The function in BoothService will throw errors on its own, No need to throw errors here.
    // this.boothService.findBoothBelongsToAccount(boothId, callerAccountId);

      * Circular dependency error; workaround to use Booth model directly
    */
    const booth = await Booth.findByPk(boothId);
    if(!booth) throw new GoodsCombinationParentBoothNotFoundException();
    if(booth.ownerId !== callerAccountId) throw new NoAccessException();

    return { combination, booth };
  }

  async findGoodsCombinationBelongsToBooth(combinationId: number, boothId: number, callerAccountId: number): Promise<GoodsCombination> {
    const { combination } = await this.getGoodsCombinationAndParentBooth(combinationId, boothId, callerAccountId);
    return combination;
  }

  async create(dto: CreateGoodsCombinationDTO, callerAccountId: number): Promise<GoodsCombination> {
    if(!(await Booth.findOne({ where: { id: dto.boothId, ownerId: callerAccountId } }))) {
      throw new GoodsCombinationParentBoothNotFoundException();
    }

    // Create combination
    const combination = await create(GoodsCombination, dto);

    // Update goods
    const goodsToBeUpdated = await Goods.findAll({
      where: {
        id: dto.goodsIds,
      },
    });
    for(const g of goodsToBeUpdated) {
      if(!g.combinationId) {
        await (g.set("combinationId", combination.id)).save();
      }
    }

    return await combination.reload();
  }

  async uploadImage(combinationId: number, boothId: number, file: MultipartFile, callerAccountId: number): Promise<IValueResponse> {
    const uploadSubpath = "goods-combination/rep";

    // TODO: file validation

    let fileName: string;
    try {
      fileName = generateUploadFileName("goodscombinationrep", callerAccountId, combinationId, "test", file.filename.split(".").pop()!).fileName;
      await this.utilService.writeFileTo(file, fileName, uploadSubpath);
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }

    try {
      const combination = await this.findGoodsCombinationBelongsToBooth(combinationId, boothId, callerAccountId);

      if(combination.combinationImageId) {
        const existingUpload = await UploadStorage.findByPk(combination.combinationImageId);
        if(existingUpload) {
          this.utilService.removeFile(existingUpload.fileName, existingUpload.savePath);
          await existingUpload.destroy({ force: true });
        }
      }

      const upload = await create(UploadStorage, {
        ownerId: callerAccountId,
        savePath: uploadSubpath,
        fileName,
      } as Omit<IUploadStorage, "id">);
      await upload.save();

      await combination.update({ combinationImageId: upload.id });

      return {
        value: upload.filePath,
      };
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }
  }

  async deleteImage(combinationId: number, boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    try {
      const combination = await this.findGoodsCombinationBelongsToBooth(combinationId, boothId, callerAccountId);

      if(combination.combinationImageId) {
        const existingUpload = await UploadStorage.findByPk(combination.combinationImageId);
        if(existingUpload) {
          this.utilService.removeFile(existingUpload.fileName, existingUpload.savePath);
          await existingUpload.destroy({ force: true });
        }
      }

      combination.set("combinationImageId", null);
      await combination.save();

      return SUCCESS_RESPONSE;
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }
  }

  async updateInfo(id: number, dto: UpdateGoodsCombinationDTO, callerAccountId: number): Promise<GoodsCombination> {
    if(dto.categoryId && dto.categoryId < 0) {
      delete dto.categoryId;
    }

    const combination = await this.findGoodsCombinationBelongsToBooth(id, dto.boothId!, callerAccountId);

    try {
      await combination.update({
        ...dto,
        boothId: undefined,  // Prevent boothId from being updated
      });
      return await combination.save();
    } catch(err) {
      throw new GoodsCombinationInfoUpdateFailedException();
    }
  }

  async remove(id: number, boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    const combination = await this.findGoodsCombinationBelongsToBooth(id, boothId, callerAccountId);

    // Find goods by combination and set to unassigned
    const goods = await Goods.findAll({
      where: {
        combinationId: id,
      },
    });
    for(const g of goods) {
      await (g.set("combinationId", null)).save();
    }

    // Delete image
    if(combination.combinationImageId) {
      // TODO: calling this.deleteImage() will execute find query again, which already found above.
      await this.deleteImage(id, boothId, callerAccountId);
    }

    return await removeTarget(combination, true);
  }
}
