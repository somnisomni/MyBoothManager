import type { MultipartFile } from "@fastify/multipart";
import { Injectable } from "@nestjs/common";
import { ISuccessResponse, ISingleValueResponse, ImageSizeConstraintKey, IImageUploadInfo } from "@myboothmanager/common";
import Goods from "@/db/models/goods";
import Booth from "@/db/models/booth";
import { create, findOneByPk, removeTarget } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { UtilService } from "../util/util.service";
import { UpdateGoodsRequestDto } from "./dto/update-goods.dto";
import { CreateGoodsRequestDto } from "./dto/create-goods.dto";
import { GoodsInfoUpdateFailedException, GoodsParentBoothNotFoundException } from "./goods.exception";

@Injectable()
export class GoodsService {
  constructor(private readonly utilService: UtilService) { }

  private async getGoodsAndParentBooth(goodsId: number, boothId: number, callerAccountId: number): Promise<{ goods: Goods, booth: Booth }> {
    const goods = await findOneByPk(Goods, goodsId);
    if(!goods) throw new EntityNotFoundException();
    if(goods.boothId !== boothId) throw new NoAccessException();

    /*
    // The function in BoothService will throw errors on its own, No need to throw errors here.
    // this.boothService.findBoothBelongsToAccount(boothId, callerAccountId);

      * Circular dependency error; workaround to use Booth model directly
    */
    const booth = await Booth.findByPk(boothId);
    if(!booth) throw new GoodsParentBoothNotFoundException();
    if(booth.ownerId !== callerAccountId) throw new NoAccessException();

    return { goods, booth };
  }

  async findGoodsBelongsToBooth(goodsId: number, boothId: number, callerAccountId: number): Promise<Goods> {
    const { goods } = await this.getGoodsAndParentBooth(goodsId, boothId, callerAccountId);
    return goods;
  }

  async create(createGoodsDto: CreateGoodsRequestDto, callerAccountId: number): Promise<Goods> {
    if(!(await Booth.findOne({ where: { ownerId: callerAccountId } }))) {
      throw new GoodsParentBoothNotFoundException();
    }

    if(createGoodsDto.stockRemaining === undefined || createGoodsDto.stockRemaining < 0) {
      createGoodsDto.stockRemaining = createGoodsDto.stockInitial;
    }

    if(createGoodsDto.categoryId && createGoodsDto.categoryId < 0) {
      delete createGoodsDto.categoryId;
    }

    return await create(Goods, createGoodsDto);
  }

  async countAll(boothId?: number): Promise<ISingleValueResponse<number>> {
    const where = boothId ? { boothId } : undefined;

    return { value: await Goods.count({ where }) };
  }

  async uploadImage(goodsId: number, boothId: number, file: MultipartFile, callerAccountId: number): Promise<IImageUploadInfo> {
    return await this.utilService.processImageUpload(
      await this.findGoodsBelongsToBooth(goodsId, boothId, callerAccountId),
      "goodsImageId",
      file,
      "goods/rep",
      ImageSizeConstraintKey.GOODS,
      callerAccountId,
    );
  }

  async deleteImage(goodsId: number, boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    return await this.utilService.processImageDelete(
      await this.findGoodsBelongsToBooth(goodsId, boothId, callerAccountId),
      "goodsImageId",
    );
  }

  async updateInfo(id: number, updateGoodsDto: UpdateGoodsRequestDto, callerAccountId: number): Promise<Goods> {
    let goods = await this.findGoodsBelongsToBooth(id, updateGoodsDto.boothId!, callerAccountId);
    const categoryId = updateGoodsDto.categoryId && updateGoodsDto.categoryId < 0 ? null : updateGoodsDto.categoryId;

    try {
      // Handling category change if the goods is combined
      if(goods.combinationId && goods.categoryId !== categoryId) {
        goods = await (goods.set("combinationId", null)).save();
      }

      return await goods.update({
        ...updateGoodsDto,
        categoryId,
        boothId: undefined,  // Prevent boothId from being updated
      });
    } catch(err) {
      throw new GoodsInfoUpdateFailedException();
    }
  }

  async remove(id: number, boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    const goods = await this.findGoodsBelongsToBooth(id, boothId, callerAccountId);

    // Delete goods image
    if(goods.goodsImageId) {
      // TODO: calling this.deleteImage() will execute find query again, which already found above.
      await this.deleteImage(id, boothId, callerAccountId);
    }

    return await removeTarget(goods);
  }
}
