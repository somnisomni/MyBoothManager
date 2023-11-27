import { Injectable } from "@nestjs/common";
import { ISuccessResponse, IValueResponse } from "@myboothmanager/common";
import Goods from "@/db/models/goods";
import Booth from "@/db/models/booth";
import { create, removeTarget } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { PublicGoodsService } from "@/modules/public/goods/goods.service";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { GoodsInfoUpdateFailedException, GoodsParentBoothNotFoundException } from "./goods.exception";

@Injectable()
export class GoodsService {
  constructor(private publicGoodsService: PublicGoodsService) { }

  private async getGoodsAndParentBooth(goodsId: number, boothId: number, callerAccountId: number): Promise<{ goods: Goods, booth: Booth }> {
    const goods = await this.publicGoodsService.findOne(goodsId);
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

  async create(createGoodsDto: CreateGoodsDTO, callerAccountId: number): Promise<Goods> {
    if(!(await Booth.findOne({ where: { ownerId: callerAccountId } }))) {
      throw new GoodsParentBoothNotFoundException();
    }

    if(createGoodsDto.stockRemaining === undefined) {
      createGoodsDto.stockRemaining = createGoodsDto.stockInitial;
    }

    if(createGoodsDto.categoryId && createGoodsDto.categoryId < 0) {
      delete createGoodsDto.categoryId;
    }

    return await create(Goods, createGoodsDto);
  }

  async countAll(boothId?: number): Promise<IValueResponse> {
    const where = boothId ? { boothId } : undefined;

    return { value: await Goods.count({ where }) };
  }

  async updateInfo(id: number, updateGoodsDto: UpdateGoodsDTO, callerAccountId: number) {
    if(updateGoodsDto.categoryId && updateGoodsDto.categoryId < 0) {
      delete updateGoodsDto.categoryId;
    }

    let goods = await this.findGoodsBelongsToBooth(id, updateGoodsDto.boothId!, callerAccountId);

    try {
      await goods.update({
        ...updateGoodsDto,
        boothId: undefined,  // Prevent boothId from being updated
      });
      goods = await goods.save();
    } catch(err) {
      throw new GoodsInfoUpdateFailedException();
    }

    return goods;
  }

  async remove(id: number, boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    const goods = await this.findGoodsBelongsToBooth(id, boothId, callerAccountId);
    return await removeTarget(goods);
  }
}
