import type { MultipartFile } from "@fastify/multipart";
import { Injectable } from "@nestjs/common";
import { ISuccessResponse, IValueResponse, ImageSizeConstraintKey } from "@myboothmanager/common";
import Booth from "@/db/models/booth";
import { create, findOneByPk, removeTarget } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
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

    // Set category ID to null if not provided or -1
    if(!dto.categoryId || dto.categoryId < 0) {
      dto.categoryId = null;
    }

    // Remove/Exclude target goods with different category
    if(dto.goodsIds) {
      const targetGoods = await Goods.findAll({
        where: {
          id: dto.goodsIds,
        },
      });
      for(const g of targetGoods) {
        if(g.categoryId !== dto.categoryId) {
          await (g.set("combinationId", null)).save();
          dto.goodsIds.splice(dto.goodsIds.indexOf(g.id), 1);
        }
      }
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
    return await this.utilService.processImageUpload(
      await this.findGoodsCombinationBelongsToBooth(combinationId, boothId, callerAccountId),
      "combinationImageId",
      file,
      "goods-combination/rep",
      ImageSizeConstraintKey.GOODS,
      callerAccountId,
    );
  }

  async deleteImage(combinationId: number, boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    return await this.utilService.processImageDelete(
      await this.findGoodsCombinationBelongsToBooth(combinationId, boothId, callerAccountId),
      "combinationImageId",
    );
  }

  async updateInfo(id: number, dto: UpdateGoodsCombinationDTO, callerAccountId: number): Promise<GoodsCombination> {
    if(dto.categoryId && dto.categoryId < 0) {
      dto.categoryId = null;
    }

    const combination = await this.findGoodsCombinationBelongsToBooth(id, dto.boothId!, callerAccountId);

    if(dto.goodsIds) {
      // Remove combination ID from existing goods
      const goodsToBeUpdated = await Goods.findAll({
        where: {
          combinationId: combination.id,
        },
      });
      for(const g of goodsToBeUpdated) {
        if(g.combinationId) {
          await (g.set("combinationId", null)).save();
        }
      }

      // Remove/Exclude target goods with different category
      const targetGoods = await Goods.findAll({
        where: {
          id: dto.goodsIds,
        },
      });
      for(const g of targetGoods) {
        if(g.categoryId !== dto.categoryId) {
          await (g.set("combinationId", null)).save();
          dto.goodsIds.splice(dto.goodsIds.indexOf(g.id), 1);
        }
      }
    }

    // Update combination
    try {
      await combination.update({
        ...dto,
        boothId: undefined,  // Prevent boothId from being updated
      });
      await (await combination.save()).reload();
    } catch(err) {
      throw new GoodsCombinationInfoUpdateFailedException();
    }

    // Assign goods to combination
    if(dto.goodsIds) {
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
    }

    // Done
    return await combination.reload();
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

    return await removeTarget(combination, undefined, true);
  }
}
